using LMS.Application.Common;
using LMS.Application.DTOs.Certificate;

namespace LMS.Application.Interfaces.Services;

public interface ICertificateService
{
    Task<BaseResponse<IEnumerable<CertificateResponse>>> GetMyCertificatesAsync();
    Task<BaseResponse<CertificateResponse>> IssueCertificateAsync(Guid courseId);
    Task<BaseResponse<CertificateResponse>> RegenerateMyCertificateAsync(Guid certificateId);
    Task<BaseResponse<CertificateResponse>> RegenerateCertificateByIdAsync(Guid certificateId);
    Task<BaseResponse<CertificateResponse>> RegenerateCertificateByNumberAsync(string certificateNumber);
    Task<BaseResponse<CertificateBulkRegenerationResponse>> RegenerateMissingCertificateDocumentsAsync();
    Task<BaseResponse<CertificateVerificationResponse>> VerifyCertificateAsync(string verificationCode);
}
