using LMS.Application.Common;
using LMS.Application.DTOs.Profile;
using LMS.Application.Interfaces.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LMS.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
[Authorize]
public class ProfileController : ControllerBase
{
    private readonly IProfileService _profileService;

    public ProfileController(IProfileService profileService)
    {
        _profileService = profileService;
    }

    /// <summary>
    /// Get the authenticated user's profile
    /// </summary>
    [HttpGet("me")]
    [ProducesResponseType(typeof(BaseResponse<UserProfileResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(BaseResponse<string>), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(BaseResponse<string>), StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> GetMyProfile()
    {
        var result = await _profileService.GetMyProfileAsync();
        return result.Success ? Ok(result) : BadRequest(result);
    }

    /// <summary>
    /// Update the authenticated user's profile
    /// </summary>
    [HttpPut("me")]
    [ProducesResponseType(typeof(BaseResponse<UserProfileResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(BaseResponse<string>), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(BaseResponse<string>), StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> UpdateMyProfile([FromBody] UpdateProfileRequest request)
    {
        var result = await _profileService.UpdateMyProfileAsync(request);
        return result.Success ? Ok(result) : BadRequest(result);
    }
}
