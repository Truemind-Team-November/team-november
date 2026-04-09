namespace LMS.Application.Common.Certificates;

public sealed record CertificateDocumentData(
    string CertificateNumber,
    string VerificationCode,
    string RecipientFullName,
    string RecipientPublicId,
    string RecipientDiscipline,
    string? RecipientCohortLabel,
    string CourseTitle,
    decimal FinalScore,
    DateTime IssuedAt,
    DateTime? CompletedAt,
    string IssuedBy,
    string TemplateVersion
);

public sealed record GeneratedCertificateDocument(
    byte[] Content,
    string FileName,
    string ContentType,
    string VerificationUrl,
    string TemplateVersion
);
