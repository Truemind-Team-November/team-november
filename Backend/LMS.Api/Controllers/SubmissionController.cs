using LMS.Application.DTOs.Assignment;
using LMS.Application.Interfaces.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LMS.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SubmissionController : ControllerBase
{
    private readonly ISubmissionService _submissionService;

    public SubmissionController(ISubmissionService submissionService)
    {
        _submissionService = submissionService;
    }

    /// <summary>
    /// Submit assignment (Learner only)
    /// </summary>
    [HttpPost]
    [Authorize(Roles = "Learner")]
    public async Task<IActionResult> Submit([FromBody] SubmitAssignmentRequest request)
    {
        var result = await _submissionService.SubmitAsync(request);

        return result.Success ? Ok(result) : BadRequest(result);
    }

    /// <summary>
    /// Grade a submission (Instructor/Admin only)
    /// </summary>
    [HttpPut("{submissionId:guid}/grade")]
    [Authorize(Roles = "Admin,Instructor")]
    public async Task<IActionResult> Grade(Guid submissionId, [FromBody] GradeSubmissionRequest request)
    {
        var result = await _submissionService.GradeAsync(submissionId, request.Score);

        return result.Success ? Ok(result) : BadRequest(result);
    }
}