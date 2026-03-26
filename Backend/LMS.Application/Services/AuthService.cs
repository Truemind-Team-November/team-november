using LMS.Application.Common;
using LMS.Application.DTOs.Auth;
using LMS.Application.Interfaces.Repositories;
using LMS.Application.Interfaces.Services;
using LMS.Domain.Entities;
using LMS.Domain.Enums;

namespace LMS.Application.Services;

public class AuthService : IAuthService
{
    private readonly IUserRepository _userRepository;
    private readonly IPasswordHasher _passwordHasher;
    private readonly IJwtService _jwtService;
    private readonly IPasswordResetTokenRepository _tokenRepository;
    private readonly IUnitOfWork _unitOfWork;

    public AuthService(
        IUserRepository userRepository,
        IPasswordHasher passwordHasher,
        IJwtService jwtService,
        IPasswordResetTokenRepository tokenRepository,
        IUnitOfWork unitOfWork)
    {
        _userRepository = userRepository;
        _passwordHasher = passwordHasher;
        _jwtService = jwtService;
        _tokenRepository = tokenRepository;
        _unitOfWork = unitOfWork;
    }
    public async Task<BaseResponse<AuthResponse>> RegisterAsync(RegisterRequest request)
    {
        var email = request.Email.Trim().ToLowerInvariant();

        var existingUser = await _userRepository.GetByEmailAsync(email);
        if (existingUser != null && existingUser.IsActive)
        {
            return BaseResponse<AuthResponse>.Fail("Email already exists");
        }

        var hashedPassword = _passwordHasher.HashPassword(request.Password);

        var user = User.Create(
            request.FirstName,
            request.LastName,
            email,
            hashedPassword,
            UserRole.Learner
        );

        await _userRepository.AddAsync(user);
        await _unitOfWork.SaveChangesAsync();

        var token = _jwtService.GenerateToken(user.Id, user.Email, user.Role.ToString());

        var response = new AuthResponse(
            user.Id,
            user.FirstName,
            user.LastName,
            user.Email,
            user.Role,
            token
        );

        return BaseResponse<AuthResponse>.Ok(response, "User registered successfully");
    }

    public async Task<BaseResponse<AuthResponse>> LoginAsync(LoginRequest request)
    {
        var email = request.Email.Trim().ToLowerInvariant();

        var user = await _userRepository.GetByEmailAsync(email);

        if (user == null || !user.IsActive)
        {
            return BaseResponse<AuthResponse>.Fail("Invalid email or password");
        }

        var isValid = _passwordHasher.VerifyPassword(request.Password, user.PasswordHash);

        if (!isValid)
        {
            return BaseResponse<AuthResponse>.Fail("Invalid email or password");
        }

        var token = _jwtService.GenerateToken(user.Id, user.Email, user.Role.ToString());

        var response = new AuthResponse(
            user.Id,
            user.FirstName,
            user.LastName,
            user.Email,
            user.Role,
            token
        );

        return BaseResponse<AuthResponse>.Ok(response, "Login successful");
    }

    public async Task<BaseResponse<string>> ForgotPasswordAsync(ForgotPasswordRequest request)
    {
        var email = request.Email.Trim().ToLowerInvariant();

        var user = await _userRepository.GetByEmailAsync(email);

        // Don't expose existence
        if (user == null || !user.IsActive)
            return BaseResponse<string>.Ok("If the email exists, a reset link has been sent");

        var token = Guid.NewGuid().ToString();

        var resetToken = PasswordResetToken.Create(
            user.Id,
            token,
            DateTime.UtcNow.AddMinutes(15)
        );

        await _tokenRepository.AddAsync(resetToken);
        await _unitOfWork.SaveChangesAsync();

        // TEMP (until email service)
        Console.WriteLine($"RESET TOKEN: {token}");

        return BaseResponse<string>.Ok("Reset token generated (check console)");
    }

    public async Task<BaseResponse<string>> ResetPasswordAsync(ResetPasswordRequest request)
    {
        if (request.Password != request.ConfirmPassword)
            return BaseResponse<string>.Fail("Passwords do not match");

        var token = await _tokenRepository.GetByTokenAsync(request.Token);

        if (token == null || token.IsUsed || token.Expiry < DateTime.UtcNow)
            return BaseResponse<string>.Fail("Invalid or expired token");

        var user = token.User;

        if (user == null || !user.IsActive)
            return BaseResponse<string>.Fail("User not found");

        var hashedPassword = _passwordHasher.HashPassword(request.Password);

        user.SetPassword(hashedPassword);

        token.MarkAsUsed();

        await _unitOfWork.SaveChangesAsync();

        return BaseResponse<string>.Ok("Password reset successful");

    }
}