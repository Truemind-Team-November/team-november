using LMS.Application.Common;
using LMS.Application.DTOs.Assignment;
using LMS.Application.Interfaces.Repositories;
using LMS.Application.Interfaces.Services;
using LMS.Domain.Entities;
using Microsoft.Extensions.Logging;
using static LMS.Application.Services.SubmissionService;

namespace LMS.Application.Services;

public class AssignmentService : IAssignmentService
{
    private readonly IAssignmentRepository _assignmentRepository;
    private readonly ICourseRepository _courseRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<AssignmentService> _logger;

    public AssignmentService(
        IAssignmentRepository assignmentRepository,
        ICourseRepository courseRepository,
        IUnitOfWork unitOfWork,
        ILogger<AssignmentService> logger)
    {
        _assignmentRepository = assignmentRepository;
        _courseRepository = courseRepository;
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    public async Task<BaseResponse<AssignmentResponse>> CreateAssignmentAsync(CreateAssignmentRequest request)
    {
        _logger.LogInformation("Creating assignment for course {CourseId}", request.CourseId);

        var course = await _courseRepository.GetByIdAsync(request.CourseId);
        if (course == null)
        {
            _logger.LogWarning("Course not found: {CourseId}", request.CourseId);
            return BaseResponse<AssignmentResponse>.Fail("Course not found");
        }

        var assignment = Assignment.Create(
            request.CourseId,
            request.Title,
            request.Description,
            request.DueDate
        );

        await _assignmentRepository.AddAsync(assignment);
        await _unitOfWork.SaveChangesAsync();

        return BaseResponse<AssignmentResponse>.Ok(
            MapToResponse(assignment),
            "Assignment created successfully"
        );
    }

    public async Task<BaseResponse<PagedResult<AssignmentResponse>>> GetPagedAsync(int page, int pageSize)
    {
        var result = await _assignmentRepository.GetPagedAsync(page, pageSize);

        var mapped = result.Items.Select(MapToResponse).ToList();

        return BaseResponse<PagedResult<AssignmentResponse>>.Ok(new PagedResult<AssignmentResponse>
        {
            Items = mapped,
            Page = result.Page,
            PageSize = result.PageSize,
            TotalCount = result.TotalCount
        });
    }

    public async Task<BaseResponse<IEnumerable<AssignmentResponse>>> GetAssignmentsByCourseIdAsync(Guid courseId)
    {
        var assignments = await _assignmentRepository.GetByCourseIdAsync(courseId);

        if (!assignments.Any())
            return BaseResponse<IEnumerable<AssignmentResponse>>.Ok([]);

        return BaseResponse<IEnumerable<AssignmentResponse>>.Ok(assignments.Select(MapToResponse));
    }

    private static AssignmentResponse MapToResponse(Assignment assignment)
    {
        return new AssignmentResponse(
            assignment.Id,
            assignment.CourseId,
            assignment.Title,
            assignment.Description,
            assignment.DueDate,
            assignment.IsPastDue()
        );
    }
}
