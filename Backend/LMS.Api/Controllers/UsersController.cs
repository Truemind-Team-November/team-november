using LMS.Application.Common;
using LMS.Application.Interfaces.Repositories;
using LMS.Application.DTOs.User;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LMS.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
[Authorize(Roles = "Admin")]
public class UsersController : ControllerBase
{
    private readonly IUserRepository _userRepository;

    public UsersController(IUserRepository userRepository)
    {
        _userRepository = userRepository;
    }

    [HttpGet]
    [ProducesResponseType(typeof(BaseResponse<IEnumerable<UserResponse>>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(BaseResponse<string>), StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> GetAllUsers()
    {
        var users = await _userRepository.GetAllAsync();
        var response = users.Select(u => new UserResponse(
            u.Id,
            u.PublicId,
            u.FirstName,
            u.LastName,
            u.FullName,
            u.Email,
            u.Discipline,
            u.PhoneNumber,
            u.CohortLabel,
            u.Location,
            u.ProfileImageUrl,       
            u.TeamId,
            u.Team?.Name,
            u.Role.ToString()
        ));

        return Ok(BaseResponse<IEnumerable<UserResponse>>.Ok(response));
    }
}
