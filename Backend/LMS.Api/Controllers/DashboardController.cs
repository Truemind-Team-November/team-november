using LMS.Application.Common;
using LMS.Application.DTOs.Dashboard;
using LMS.Application.Interfaces.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LMS.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
[Authorize]
public class DashboardController : ControllerBase
{
    private readonly IDashboardService _dashboardService;

    public DashboardController(IDashboardService dashboardService)
    {
        _dashboardService = dashboardService;
    }

    /// <summary>
    /// Get the authenticated user's dashboard overview
    /// </summary>
    [HttpGet("me")]
    [ProducesResponseType(typeof(BaseResponse<DashboardResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(BaseResponse<string>), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(BaseResponse<string>), StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> GetMyDashboard()
    {
        var result = await _dashboardService.GetMyDashboardAsync();
        return result.Success ? Ok(result) : BadRequest(result);
    }
}
