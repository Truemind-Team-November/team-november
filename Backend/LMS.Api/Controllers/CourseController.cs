using LMS.Application.Common;
using LMS.Application.DTOs.Course;
using LMS.Application.Interfaces.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LMS.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
public class CourseController : ControllerBase
{
    private readonly ICourseService _courseService;

    public CourseController(ICourseService courseService)
    {
        _courseService = courseService;
    }

    [HttpPost]
    [Authorize(Roles = "Admin,Instructor")]
    [ProducesResponseType(typeof(BaseResponse<CourseResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(BaseResponse<string>), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Create([FromBody] CreateCourseRequest request)
    {
        var result = await _courseService.CreateCourseAsync(request);
        return result.Success ? Ok(result) : BadRequest(result);
    }

    [HttpPut("{id:guid}")]
    [Authorize(Roles = "Admin,Instructor")]
    [ProducesResponseType(typeof(BaseResponse<CourseResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(BaseResponse<string>), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateCourseRequest request)
    {
        var result = await _courseService.UpdateCourseAsync(id, request);
        return result.Success ? Ok(result) : BadRequest(result);
    }

    [HttpGet]
    [Authorize]
    [ProducesResponseType(typeof(BaseResponse<IEnumerable<CourseCatalogItemResponse>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetCatalog(
        [FromQuery] string? search = null,
        [FromQuery] string? category = null,
        [FromQuery] bool enrolledOnly = false)
    {
        var result = await _courseService.GetCatalogAsync(search, category, enrolledOnly);
        return Ok(result);
    }

    [HttpGet("{id:guid}")]
    [Authorize]
    [ProducesResponseType(typeof(BaseResponse<CourseDetailResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(BaseResponse<string>), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetDetail(Guid id)
    {
        var result = await _courseService.GetCourseDetailAsync(id);
        return result.Success ? Ok(result) : NotFound(result);
    }
}
