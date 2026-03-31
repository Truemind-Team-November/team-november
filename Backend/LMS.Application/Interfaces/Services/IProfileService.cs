using LMS.Application.Common;
using LMS.Application.DTOs.Profile;

namespace LMS.Application.Interfaces.Services;

public interface IProfileService
{
    Task<BaseResponse<UserProfileResponse>> GetMyProfileAsync();
    Task<BaseResponse<UserProfileResponse>> UpdateMyProfileAsync(UpdateProfileRequest request);
}
