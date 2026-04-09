using LMS.Application.Common;
using LMS.Application.DTOs.Team;
using LMS.Application.Interfaces.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LMS.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
[Authorize]
public class TeamController : ControllerBase
{
    private readonly ITeamService _teamService;

    public TeamController(ITeamService teamService)
    {
        _teamService = teamService;
    }

    /// <summary>
    /// Get all teams with members
    /// </summary>
    [HttpGet]
    [Authorize(Roles = "Admin")]
    [ProducesResponseType(typeof(BaseResponse<IEnumerable<TeamResponse>>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(BaseResponse<string>), StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> GetTeams()
    {
        var result = await _teamService.GetTeamsAsync();
        return Ok(result);
    }

    /// <summary>
    /// Get available disciplines for registration and admin configuration
    /// </summary>
    [HttpGet("disciplines")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(BaseResponse<IEnumerable<DisciplineResponse>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetDisciplines()
    {
        var result = await _teamService.GetDisciplinesAsync();
        return Ok(result);
    }

    /// <summary>
    /// Get the authenticated user's team
    /// </summary>
    [HttpGet("my-team")]
    [ProducesResponseType(typeof(BaseResponse<TeamResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(BaseResponse<string>), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(BaseResponse<string>), StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> GetMyTeam()
    {
        var result = await _teamService.GetMyTeamAsync();
        return result.Success ? Ok(result) : BadRequest(result);
    }

    /// <summary>
    /// Get the full team allocation view (All authenticated users)
    /// </summary>
    [HttpGet("allocation")]
    [ProducesResponseType(typeof(BaseResponse<IEnumerable<TeamAllocationResponse>>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(BaseResponse<string>), StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> GetTeamAllocation()
    {
        var result = await _teamService.GetTeamAllocationAsync();
        return Ok(result);
    }

    /// <summary>
    /// Get learners who are not yet assigned to any team (Admin only)
    /// </summary>
    [HttpGet("unassigned-learners")]
    [Authorize(Roles = "Admin")]
    [ProducesResponseType(typeof(BaseResponse<IEnumerable<AllocatableLearnerResponse>>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(BaseResponse<string>), StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> GetUnassignedLearners()
    {
        var result = await _teamService.GetUnassignedLearnersAsync();
        return Ok(result);
    }

    /// <summary>
    /// Create a team
    /// </summary>
    [HttpPost]
    [Authorize(Roles = "Admin")]
    [ProducesResponseType(typeof(BaseResponse<TeamResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(BaseResponse<string>), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> CreateTeam([FromBody] CreateTeamRequest request)
    {
        var result = await _teamService.CreateTeamAsync(request);
        return result.Success ? Ok(result) : BadRequest(result);
    }

    /// <summary>
    /// Update a team
    /// </summary>
    [HttpPut("{teamId:guid}")]
    [Authorize(Roles = "Admin")]
    [ProducesResponseType(typeof(BaseResponse<TeamResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(BaseResponse<string>), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> UpdateTeam(Guid teamId, [FromBody] UpdateTeamRequest request)
    {
        var result = await _teamService.UpdateTeamAsync(teamId, request);
        return result.Success ? Ok(result) : BadRequest(result);
    }

    /// <summary>
    /// Delete a team
    /// </summary>
    [HttpDelete("{teamId:guid}")]
    [Authorize(Roles = "Admin")]
    [ProducesResponseType(typeof(BaseResponse<string>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(BaseResponse<string>), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> DeleteTeam(Guid teamId)
    {
        var result = await _teamService.DeleteTeamAsync(teamId);
        return result.Success ? Ok(result) : BadRequest(result);
    }

    /// <summary>
    /// Assign or move a learner to a team
    /// </summary>
    [HttpPut("{teamId:guid}/members/{userId:guid}")]
    [Authorize(Roles = "Admin")]
    [ProducesResponseType(typeof(BaseResponse<TeamMemberResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(BaseResponse<string>), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> AssignUserToTeam(Guid teamId, Guid userId)
    {
        var result = await _teamService.AssignUserToTeamAsync(teamId, userId);
        return result.Success ? Ok(result) : BadRequest(result);
    }

    /// <summary>
    /// Remove a learner from their assigned team
    /// </summary>
    [HttpDelete("members/{userId:guid}")]
    [Authorize(Roles = "Admin")]
    [ProducesResponseType(typeof(BaseResponse<string>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(BaseResponse<string>), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> RemoveUserFromTeam(Guid userId)
    {
        var result = await _teamService.RemoveUserFromTeamAsync(userId);
        return result.Success ? Ok(result) : BadRequest(result);
    }

    /// <summary>
    /// Create a discipline
    /// </summary>
    [HttpPost("disciplines")]
    [Authorize(Roles = "Admin")]
    [ProducesResponseType(typeof(BaseResponse<DisciplineResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(BaseResponse<string>), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> CreateDiscipline([FromBody] CreateDisciplineRequest request)
    {
        var result = await _teamService.CreateDisciplineAsync(request);
        return result.Success ? Ok(result) : BadRequest(result);
    }

    /// <summary>
    /// Update a discipline
    /// </summary>
    [HttpPut("disciplines/{disciplineId:guid}")]
    [Authorize(Roles = "Admin")]
    [ProducesResponseType(typeof(BaseResponse<DisciplineResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(BaseResponse<string>), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> UpdateDiscipline(Guid disciplineId, [FromBody] UpdateDisciplineRequest request)
    {
        var result = await _teamService.UpdateDisciplineAsync(disciplineId, request);
        return result.Success ? Ok(result) : BadRequest(result);
    }

    /// <summary>
    /// Delete a discipline
    /// </summary>
    [HttpDelete("disciplines/{disciplineId:guid}")]
    [Authorize(Roles = "Admin")]
    [ProducesResponseType(typeof(BaseResponse<string>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(BaseResponse<string>), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> DeleteDiscipline(Guid disciplineId)
    {
        var result = await _teamService.DeleteDisciplineAsync(disciplineId);
        return result.Success ? Ok(result) : BadRequest(result);
    }
}
