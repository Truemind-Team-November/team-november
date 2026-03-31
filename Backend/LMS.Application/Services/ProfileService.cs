using LMS.Application.Common;
using LMS.Application.DTOs.Profile;
using LMS.Application.Interfaces.Repositories;
using LMS.Application.Interfaces.Services;

namespace LMS.Application.Services;

public class ProfileService : IProfileService
{
    private readonly IProfileRepository _profileRepository;
    private readonly IUserRepository _userRepository;
    private readonly ICurrentUserService _currentUserService;

    public ProfileService(
        IProfileRepository profileRepository,
        IUserRepository userRepository,
        ICurrentUserService currentUserService)
    {
        _profileRepository = profileRepository;
        _userRepository = userRepository;
        _currentUserService = currentUserService;
    }

    public async Task<BaseResponse<UserProfileResponse>> GetMyProfileAsync()
    {
        if (_currentUserService.UserId == null)
            return BaseResponse<UserProfileResponse>.Fail("Unauthorized");

        var profile = await _profileRepository.GetProfileAsync(_currentUserService.UserId.Value);
        if (profile == null)
            return BaseResponse<UserProfileResponse>.Fail("User not found");

        return BaseResponse<UserProfileResponse>.Ok(profile);
    }

    public async Task<BaseResponse<UserProfileResponse>> UpdateMyProfileAsync(UpdateProfileRequest request)
    {
        if (_currentUserService.UserId == null)
            return BaseResponse<UserProfileResponse>.Fail("Unauthorized");

        var user = await _userRepository.GetByIdAsync(_currentUserService.UserId.Value);
        if (user == null)
            return BaseResponse<UserProfileResponse>.Fail("User not found");

        user.UpdateProfile(request.FirstName, request.LastName, request.PhoneNumber);
        await _userRepository.UpdateAsync(user);

        var profile = await _profileRepository.GetProfileAsync(user.Id);
        if (profile == null)
            return BaseResponse<UserProfileResponse>.Fail("Profile not found");

        return BaseResponse<UserProfileResponse>.Ok(profile, "Profile updated successfully");
    }
}
