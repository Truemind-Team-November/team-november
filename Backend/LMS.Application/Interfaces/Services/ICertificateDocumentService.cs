using LMS.Application.Common.Certificates;

namespace LMS.Application.Interfaces.Services;

public interface ICertificateDocumentService
{
    Task<GeneratedCertificateDocument> GenerateAsync(CertificateDocumentData documentData, CancellationToken cancellationToken = default);
    string BuildVerificationUrl(string verificationCode);
}
