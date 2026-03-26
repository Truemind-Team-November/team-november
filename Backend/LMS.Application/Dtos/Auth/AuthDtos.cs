using LMS.Domain.Enums;

namespace LMS.Application.DTOs.Auth;

public record RegisterRequest(string FirstName, string LastName, string Email, string Password, string ConfirmPassword);
public record LoginRequest(string Email, string Password);
public record AuthResponse(Guid Id, string FirstName, string LastName, string Email, UserRole Role, string Token);

public record ForgotPasswordRequest(string Email);
public record ResetPasswordRequest( string Token, string Password, string ConfirmPassword);
