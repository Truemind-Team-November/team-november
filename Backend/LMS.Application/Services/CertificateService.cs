using LMS.Application.Common;
using LMS.Application.Common.Certificates;
using LMS.Application.Common.Options;
using LMS.Application.DTOs.Certificate;
using LMS.Application.Interfaces.Repositories;
using LMS.Application.Interfaces.Services;
using LMS.Domain.Entities;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace LMS.Application.Services;

public class CertificateService : ICertificateService
{
    private readonly ICertificateRepository _certificateRepository;
    private readonly IAssignmentRepository _assignmentRepository;
    private readonly IEnrollmentRepository _enrollmentRepository;
    private readonly IProgressRepository _progressRepository;
    private readonly ISubmissionRepository _submissionRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ICurrentUserService _currentUserService;
    private readonly INotificationService _notificationService;
    private readonly ICertificateDocumentService _certificateDocumentService;
    private readonly IBackgroundJobDispatcher _backgroundJobDispatcher;
    private readonly IFileStorageService _fileStorageService;
    private readonly FileStorageOptions _fileStorageOptions;
    private readonly CertificateOptions _certificateOptions;
    private readonly ILogger<CertificateService> _logger;

    public CertificateService(
        ICertificateRepository certificateRepository,
        IAssignmentRepository assignmentRepository,
        IEnrollmentRepository enrollmentRepository,
        IProgressRepository progressRepository,
        ISubmissionRepository submissionRepository,
        IUnitOfWork unitOfWork,
        ICurrentUserService currentUserService,
        INotificationService notificationService,
        ICertificateDocumentService certificateDocumentService,
        IBackgroundJobDispatcher backgroundJobDispatcher,
        IFileStorageService fileStorageService,
        IOptions<FileStorageOptions> fileStorageOptions,
        IOptions<CertificateOptions> certificateOptions,
        ILogger<CertificateService> logger)
    {
        _certificateRepository = certificateRepository;
        _assignmentRepository = assignmentRepository;
        _enrollmentRepository = enrollmentRepository;
        _progressRepository = progressRepository;
        _submissionRepository = submissionRepository;
        _unitOfWork = unitOfWork;
        _currentUserService = currentUserService;
        _notificationService = notificationService;
        _certificateDocumentService = certificateDocumentService;
        _backgroundJobDispatcher = backgroundJobDispatcher;
        _fileStorageService = fileStorageService;
        _fileStorageOptions = fileStorageOptions.Value;
        _certificateOptions = certificateOptions.Value;
        _logger = logger;
    }

    public async Task<BaseResponse<IEnumerable<CertificateResponse>>> GetMyCertificatesAsync()
    {
        if (_currentUserService.UserId == null)
            return BaseResponse<IEnumerable<CertificateResponse>>.Fail("Unauthorized");

        var userId = _currentUserService.UserId.Value;
        var certificates = await _certificateRepository.GetByUserIdAsync(userId);

        var verificationCodesAdded = false;
        foreach (var certificate in certificates)
        {
            verificationCodesAdded |= certificate.EnsureVerificationCode();
        }

        if (verificationCodesAdded)
            await _unitOfWork.SaveChangesAsync();

        return BaseResponse<IEnumerable<CertificateResponse>>.Ok(
            certificates
                .OrderByDescending(item => item.IssuedAt)
                .Select(MapToResponse));
    }

    public async Task<BaseResponse<CertificateResponse>> IssueCertificateAsync(Guid courseId)
    {
        if (_currentUserService.UserId == null)
            return BaseResponse<CertificateResponse>.Fail("Unauthorized");

        var userId = _currentUserService.UserId.Value;

        var existing = await _certificateRepository.GetByUserAndCourseAsync(userId, courseId);
        if (existing != null)
        {
            if (existing.EnsureVerificationCode())
                await _unitOfWork.SaveChangesAsync();

            return BaseResponse<CertificateResponse>.Ok(MapToResponse(existing), "Certificate already issued for this course");
        }

        var enrollment = await _enrollmentRepository.GetByUserAndCourseAsync(userId, courseId);
        if (enrollment == null)
            return BaseResponse<CertificateResponse>.Fail("You are not enrolled in this course");

        if (!enrollment.IsCompleted)
            return BaseResponse<CertificateResponse>.Fail("Course must be completed before issuing certificate");

        var progress = await _progressRepository.GetByUserAndCourseAsync(userId, courseId);
        if (progress == null || progress.Percentage < 100)
            return BaseResponse<CertificateResponse>.Fail("Course progress must be 100% before issuing certificate");

        var assignments = await _assignmentRepository.GetByCourseIdAsync(courseId);
        if (!assignments.Any())
            return BaseResponse<CertificateResponse>.Fail("This course does not have any certificate-eligible assignments");

        var submissions = await _submissionRepository.GetByUserIdAsync(userId);
        var courseSubmissions = submissions
            .Where(s => s.Assignment.CourseId == courseId)
            .ToDictionary(s => s.AssignmentId, s => s);

        var missingSubmission = assignments.FirstOrDefault(assignment => !courseSubmissions.ContainsKey(assignment.Id));
        if (missingSubmission != null)
            return BaseResponse<CertificateResponse>.Fail("All course assignments must be submitted before issuing certificate");

        var ungradedSubmission = assignments
            .Select(assignment => courseSubmissions[assignment.Id])
            .FirstOrDefault(submission => !submission.Score.HasValue);
        if (ungradedSubmission != null)
            return BaseResponse<CertificateResponse>.Fail("All course assignments must be graded before issuing certificate");

        var finalScore = assignments
            .Select(assignment => courseSubmissions[assignment.Id].Score!.Value)
            .Average();
        var courseTitle = assignments.First().Course?.Title ?? "your course";

        if (finalScore < 50)
            return BaseResponse<CertificateResponse>.Fail("Minimum score not reached for certification");

        var firstSubmission = courseSubmissions.Values.First();
        var certificate = Certificate.Create(
            userId,
            courseId,
            finalScore,
            firstSubmission.User?.FullName ?? "Unknown Learner",
            firstSubmission.User?.PublicId ?? "Unknown",
            string.IsNullOrWhiteSpace(firstSubmission.User?.Discipline) ? "Not assigned" : firstSubmission.User!.Discipline,
            firstSubmission.User?.CohortLabel,
            courseTitle,
            enrollment.CompletedAt,
            _certificateOptions.IssuerName,
            _certificateOptions.TemplateVersion);

        var generationError = await GenerateAndAttachDocumentAsync(certificate);
        if (generationError != null)
            return BaseResponse<CertificateResponse>.Fail(generationError);

        await _certificateRepository.AddAsync(certificate);

        try
        {
            await _unitOfWork.SaveChangesAsync();
        }
        catch (Exception ex) when (IsCertificateDuplicate(ex))
        {
            _logger.LogWarning(ex, "Duplicate certificate issuance prevented for user {UserId} and course {CourseId}", userId, courseId);
            var duplicate = await _certificateRepository.GetByUserAndCourseAsync(userId, courseId);
            if (duplicate != null)
            {
                if (duplicate.EnsureVerificationCode())
                    await _unitOfWork.SaveChangesAsync();

                return BaseResponse<CertificateResponse>.Ok(MapToResponse(duplicate), "Certificate already issued for this course");
            }

            return BaseResponse<CertificateResponse>.Fail("Certificate already issued for this course");
        }

        await _notificationService.NotifyUserAsync(new LMS.Application.DTOs.Notification.CreateNotificationRequest(
            userId,
            LMS.Domain.Enums.NotificationType.CertificateMilestone,
            "Certificate Milestone",
            $"You earned a certificate for completing {courseTitle}.",
            "/certificates"
        ));

        return BaseResponse<CertificateResponse>.Ok(MapToResponse(certificate), "Certificate issued successfully");
    }

    public async Task<BaseResponse<CertificateResponse>> RegenerateMyCertificateAsync(Guid certificateId)
    {
        if (_currentUserService.UserId == null)
            return BaseResponse<CertificateResponse>.Fail("Unauthorized");

        var certificate = await _certificateRepository.GetByIdAsync(certificateId);
        if (certificate == null || certificate.UserId != _currentUserService.UserId.Value)
            return BaseResponse<CertificateResponse>.Fail("Certificate not found");

        return await RegenerateCertificateDocumentAsync(certificate, "Certificate document regenerated successfully");
    }

    public async Task<BaseResponse<CertificateResponse>> RegenerateCertificateByIdAsync(Guid certificateId)
    {
        var certificate = await _certificateRepository.GetByIdAsync(certificateId);
        if (certificate == null)
            return BaseResponse<CertificateResponse>.Fail("Certificate not found");

        return await RegenerateCertificateDocumentAsync(certificate, "Certificate document regenerated successfully");
    }

    public async Task<BaseResponse<CertificateResponse>> RegenerateCertificateByNumberAsync(string certificateNumber)
    {
        var certificate = await _certificateRepository.GetByCertificateNumberAsync(certificateNumber);
        if (certificate == null)
            return BaseResponse<CertificateResponse>.Fail("Certificate not found");

        return await RegenerateCertificateDocumentAsync(certificate, "Certificate document regenerated successfully");
    }

    public async Task<BaseResponse<CertificateBulkRegenerationResponse>> RegenerateMissingCertificateDocumentsAsync()
    {
        var certificates = await _certificateRepository.GetAllAsync();
        var missingDocuments = certificates
            .Where(certificate => string.IsNullOrWhiteSpace(certificate.DocumentUrl))
            .ToList();

        var failures = new List<CertificateRegenerationFailureResponse>();
        var regeneratedCount = 0;

        foreach (var certificate in missingDocuments)
        {
            var generationError = await GenerateAndAttachDocumentAsync(certificate);
            if (generationError != null)
            {
                failures.Add(new CertificateRegenerationFailureResponse(
                    certificate.CertificateNumber,
                    generationError));
                continue;
            }

            await _certificateRepository.UpdateAsync(certificate);
            regeneratedCount++;
        }

        await _unitOfWork.SaveChangesAsync();

        var response = new CertificateBulkRegenerationResponse(
            missingDocuments.Count,
            regeneratedCount,
            failures.Count,
            failures);

        return BaseResponse<CertificateBulkRegenerationResponse>.Ok(
            response,
            failures.Count == 0
                ? "All missing certificate documents regenerated successfully"
                : "Missing certificate documents regenerated with some failures");
    }

    public async Task<BaseResponse<CertificateVerificationResponse>> VerifyCertificateAsync(string verificationCode)
    {
        var certificate = await _certificateRepository.GetByVerificationCodeAsync(verificationCode);
        if (certificate == null)
            return BaseResponse<CertificateVerificationResponse>.Fail("Certificate not found");

        return BaseResponse<CertificateVerificationResponse>.Ok(MapToVerificationResponse(certificate));
    }

    private CertificateResponse MapToResponse(Certificate certificate)
    {
        return new CertificateResponse(
            certificate.Id,
            certificate.UserId,
            certificate.CourseId,
            string.IsNullOrWhiteSpace(certificate.CourseTitleSnapshot) ? certificate.Course?.Title ?? "Unknown" : certificate.CourseTitleSnapshot,
            string.IsNullOrWhiteSpace(certificate.RecipientFullName) ? certificate.User?.FullName ?? "Unknown" : certificate.RecipientFullName,
            string.IsNullOrWhiteSpace(certificate.RecipientPublicId) ? certificate.User?.PublicId ?? "Unknown" : certificate.RecipientPublicId,
            string.IsNullOrWhiteSpace(certificate.RecipientDiscipline) ? certificate.User?.Discipline ?? "Unknown" : certificate.RecipientDiscipline,
            certificate.RecipientCohortLabel ?? certificate.User?.CohortLabel,
            certificate.FinalScore,
            certificate.CertificateNumber,
            certificate.IssuedAt,
            certificate.CompletedAt,
            string.IsNullOrWhiteSpace(certificate.IssuedBy) ? _certificateOptions.IssuerName : certificate.IssuedBy,
            string.IsNullOrWhiteSpace(certificate.TemplateVersion) ? _certificateOptions.TemplateVersion : certificate.TemplateVersion,
            certificate.DocumentUrl,
            BuildVerificationUrl(certificate)
        );
    }

    private CertificateVerificationResponse MapToVerificationResponse(Certificate certificate)
    {
        return new CertificateVerificationResponse(
            certificate.CertificateNumber,
            string.IsNullOrWhiteSpace(certificate.CourseTitleSnapshot) ? certificate.Course?.Title ?? "Unknown" : certificate.CourseTitleSnapshot,
            string.IsNullOrWhiteSpace(certificate.RecipientFullName) ? certificate.User?.FullName ?? "Unknown" : certificate.RecipientFullName,
            string.IsNullOrWhiteSpace(certificate.RecipientPublicId) ? certificate.User?.PublicId ?? "Unknown" : certificate.RecipientPublicId,
            string.IsNullOrWhiteSpace(certificate.RecipientDiscipline) ? certificate.User?.Discipline ?? "Unknown" : certificate.RecipientDiscipline,
            certificate.RecipientCohortLabel ?? certificate.User?.CohortLabel,
            certificate.FinalScore,
            certificate.IssuedAt,
            certificate.CompletedAt,
            string.IsNullOrWhiteSpace(certificate.IssuedBy) ? _certificateOptions.IssuerName : certificate.IssuedBy,
            string.IsNullOrWhiteSpace(certificate.TemplateVersion) ? _certificateOptions.TemplateVersion : certificate.TemplateVersion,
            certificate.DocumentUrl,
            BuildVerificationUrl(certificate)
        );
    }

    private async Task<string?> GenerateAndAttachDocumentAsync(Certificate certificate)
    {
        return await _backgroundJobDispatcher.RunAsync(async cancellationToken =>
        {
            certificate.EnsureVerificationCode();

            GeneratedCertificateDocument generatedDocument;
            try
            {
                generatedDocument = await _certificateDocumentService.GenerateAsync(BuildDocumentData(certificate), cancellationToken);
            }
            catch (InvalidOperationException ex)
            {
                _logger.LogWarning(ex, "Certificate document generation failed for {CertificateNumber}", certificate.CertificateNumber);
                return ex.Message;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected certificate document generation failure for {CertificateNumber}", certificate.CertificateNumber);
                return "Certificate document generation failed";
            }

            try
            {
                await using var contentStream = new MemoryStream(generatedDocument.Content);
                var uploadResult = await _fileStorageService.UploadDocumentAsync(new LMS.Application.Common.Storage.FileUploadRequest(
                        contentStream,
                        generatedDocument.FileName,
                        generatedDocument.ContentType,
                        _fileStorageOptions.CertificateDocumentFolder),
                    cancellationToken);

                certificate.AttachDocument(uploadResult.Url);
                return null;
            }
            catch (InvalidOperationException ex)
            {
                _logger.LogWarning(ex, "Certificate document upload failed for {CertificateNumber}", certificate.CertificateNumber);
                return ex.Message;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected certificate document upload failure for {CertificateNumber}", certificate.CertificateNumber);
                return "Certificate document upload failed";
            }
        });
    }

    private async Task<BaseResponse<CertificateResponse>> RegenerateCertificateDocumentAsync(
        Certificate certificate,
        string successMessage)
    {
        var generationError = await GenerateAndAttachDocumentAsync(certificate);
        if (generationError != null)
            return BaseResponse<CertificateResponse>.Fail(generationError);

        await _certificateRepository.UpdateAsync(certificate);
        await _unitOfWork.SaveChangesAsync();

        return BaseResponse<CertificateResponse>.Ok(MapToResponse(certificate), successMessage);
    }

    private static CertificateDocumentData BuildDocumentData(Certificate certificate)
    {
        certificate.EnsureVerificationCode();

        return new CertificateDocumentData(
            certificate.CertificateNumber,
            certificate.VerificationCode,
            certificate.RecipientFullName,
            certificate.RecipientPublicId,
            certificate.RecipientDiscipline,
            certificate.RecipientCohortLabel,
            certificate.CourseTitleSnapshot,
            certificate.FinalScore,
            certificate.IssuedAt,
            certificate.CompletedAt,
            certificate.IssuedBy,
            certificate.TemplateVersion);
    }

    private static bool IsCertificateDuplicate(Exception exception)
    {
        const string uniqueViolationCode = "23505";

        if (exception.GetType().FullName == "Microsoft.EntityFrameworkCore.DbUpdateException"
            && exception.InnerException?.GetType().FullName == "Npgsql.PostgresException")
        {
            var sqlState = exception.InnerException.GetType().GetProperty("SqlState")?.GetValue(exception.InnerException) as string;
            return string.Equals(sqlState, uniqueViolationCode, StringComparison.Ordinal);
        }

        return false;
    }

    private string BuildVerificationUrl(Certificate certificate)
    {
        certificate.EnsureVerificationCode();
        return _certificateDocumentService.BuildVerificationUrl(certificate.VerificationCode);
    }
}
