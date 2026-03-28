using LMS.Application.Common;
using LMS.Application.DTOs.Auth;

namespace LMS.Application.Interfaces.Services;

public interface IAuthService
{
    Task<BaseResponse<AuthResponse>> RegisterAsync(RegisterRequest request);
    Task<BaseResponse<AuthResponse>> LoginAsync(LoginRequest request);
}
