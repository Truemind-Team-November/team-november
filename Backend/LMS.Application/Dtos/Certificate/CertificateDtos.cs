namespace LMS.Application.DTOs.Certificate;

public record CertificateResponse(
    Guid Id,
    Guid UserId,
    Guid CourseId,
    string CourseTitle,
    string UserFullName,
    string PublicId,
    string Discipline,
    string? CohortLabel,
    decimal FinalScore,
    string CertificateNumber,
    DateTime IssuedAt,
    DateTime? CompletedAt,
    string IssuedBy,
    string TemplateVersion,
    string? DocumentUrl,
    string VerificationUrl
);

public record CertificateVerificationResponse(
    string CertificateNumber,
    string CourseTitle,
    string UserFullName,
    string PublicId,
    string Discipline,
    string? CohortLabel,
    decimal FinalScore,
    DateTime IssuedAt,
    DateTime? CompletedAt,
    string IssuedBy,
    string TemplateVersion,
    string? DocumentUrl,
    string VerificationUrl
);

public record CertificateRegenerationFailureResponse(
    string CertificateNumber,
    string Reason
);

public record CertificateBulkRegenerationResponse(
    int ProcessedCount,
    int RegeneratedCount,
    int FailedCount,
    IReadOnlyCollection<CertificateRegenerationFailureResponse> Failures
);
