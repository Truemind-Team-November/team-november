namespace LMS.Application.DTOs.Auth;

public record RegisterRequest(string FirstName, string LastName, string Email, string Password);
public record LoginRequest(string Email, string Password);
public record AuthResponse(Guid Id, string FirstName, string LastName, string Email, string Role, string Token);
