namespace LMS.Application.DTOs.User;

public record UserResponse(
    Guid Id,
    string PublicId,
    string FirstName,
    string LastName,
    string FullName,
    string Email,
    string Discipline,
    string? PhoneNumber,
    string? CohortLabel,
    string? Location,
    string? ProfileImageUrl,
    Guid? TeamId,
    string? TeamName,
    string Role
);
