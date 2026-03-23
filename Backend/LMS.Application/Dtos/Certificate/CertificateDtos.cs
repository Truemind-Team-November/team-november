namespace LMS.Application.DTOs.Certificate;

public record CertificateResponse(Guid Id, Guid UserId, Guid CourseId, string CourseTitle, string UserFullName, decimal finalScore, string certificateNumber, DateTime IssuedAt);
