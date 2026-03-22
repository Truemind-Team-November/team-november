using LMS.Application.Common;
using LMS.Application.DTOs.Auth;
using LMS.Application.Interfaces.Repositories;
using LMS.Application.Interfaces.Services;
using LMS.Domain.Entities;

namespace LMS.Application.Services;

public class AuthService : IAuthService
{
    private readonly IUserRepository _userRepository;
    private readonly IPasswordHasher _passwordHasher;
    private readonly IJwtService _jwtService;
    private readonly IUnitOfWork _unitOfWork;

    public AuthService(
        IUserRepository userRepository,
        IPasswordHasher passwordHasher,
        IJwtService jwtService,
        IUnitOfWork unitOfWork)
    {
        _userRepository = userRepository;
        _passwordHasher = passwordHasher;
        _jwtService = jwtService;
        _unitOfWork = unitOfWork;
    }
    public async Task<BaseResponse<AuthResponse>> RegisterAsync(RegisterRequest request)
    {
         var email = request.Email.Trim().ToLower();
        var existingUser = await _userRepository.GetByEmailAsync(email);
        if (existingUser != null)
        {
            return BaseResponse<AuthResponse>.Fail("Email already exists");
        }

        var hashedPassword = _passwordHasher.HashPassword(request.Password);

        var user = User.Create(
            request.FirstName,
            request.LastName,
            email,
            hashedPassword
        );

        await _userRepository.AddAsync(user);
        await _unitOfWork.SaveChangesAsync();

        var token = _jwtService.GenerateToken(user.Id, user.Email, user.Role.ToString());

        var response = new AuthResponse(user.Id, user.FirstName, user.LastName, user.Email, user.Role.ToString(), token);

        return BaseResponse<AuthResponse>.Ok(response, "User registered successfully");
    }

    public async Task<BaseResponse<AuthResponse>> LoginAsync(LoginRequest request)
    {
        var email = request.Email.Trim().ToLower();
        var user = await _userRepository.GetByEmailAsync(email);
        if (user == null)
        {
            return BaseResponse<AuthResponse>.Fail("Invalid email or password");
        }

        var isValid = _passwordHasher.VerifyPassword(request.Password, user.PasswordHash);
        if (!isValid)
        {
            return BaseResponse<AuthResponse>.Fail("Invalid email or password");
        }

        var token = _jwtService.GenerateToken(user.Id, user.Email, user.Role.ToString());

        var response = new AuthResponse(user.Id, user.FirstName, user.LastName, user.Email, user.Role.ToString(), token);

        return BaseResponse<AuthResponse>.Ok(response, "Login successful");
    }
}