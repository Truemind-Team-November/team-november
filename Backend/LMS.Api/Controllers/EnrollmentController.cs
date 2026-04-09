using LMS.Application.Common;
using LMS.Application.DTOs.Enrollment;
using LMS.Application.Interfaces.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LMS.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
public class EnrollmentController : ControllerBase
{
    private readonly IEnrollmentService _enrollmentService;

    public EnrollmentController(IEnrollmentService enrollmentService)
    {
        _enrollmentService = enrollmentService;
    }

    /// <summary>
    /// Enroll the authenticated learner in a course
    /// </summary>
    [HttpPost("{courseId:guid}")]
    [Authorize(Roles = "Learner")]
    [ProducesResponseType(typeof(BaseResponse<EnrollmentResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(BaseResponse<string>), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(BaseResponse<string>), StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> Enroll(Guid courseId)
    {
        var result = await _enrollmentService.EnrollCurrentUserAsync(courseId);
        return result.Success ? Ok(result) : result.Message.Contains("Unauthorized") ? Unauthorized(result) : BadRequest(result);
    }
}
