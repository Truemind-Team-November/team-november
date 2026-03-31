using LMS.Application.Common;
using LMS.Application.DTOs.Course;
using LMS.Application.Interfaces.Repositories;
using LMS.Application.Interfaces.Services;
using LMS.Domain.Entities;

namespace LMS.Application.Services;

public class CourseService : ICourseService
{
    private readonly ICourseRepository _courseRepository;
    private readonly ICourseBrowseRepository _courseBrowseRepository;
    private readonly ICurrentUserService _currentUserService;

    public CourseService(
        ICourseRepository courseRepository,
        ICourseBrowseRepository courseBrowseRepository,
        ICurrentUserService currentUserService)
    {
        _courseRepository = courseRepository;
        _courseBrowseRepository = courseBrowseRepository;
        _currentUserService = currentUserService;
    }

    public async Task<BaseResponse<CourseResponse>> CreateCourseAsync(CreateCourseRequest request)
    {
        var course = Course.Create(
            request.Title,
            request.Description,
            request.Category,
            request.EstimatedHours,
            request.ThumbnailUrl,
            request.InstructorId
        );
        await _courseRepository.AddAsync(course);

        var response = MapToResponse(course);
        return BaseResponse<CourseResponse>.Ok(response, "Course created successfully");
    }

    public async Task<BaseResponse<CourseResponse>> UpdateCourseAsync(Guid id, UpdateCourseRequest request)
    {
        var course = await _courseRepository.GetByIdAsync(id);
        if (course == null) return BaseResponse<CourseResponse>.Fail("Course not found");

        course.UpdateDetails(
            request.Title,
            request.Description,
            request.Category,
            request.EstimatedHours,
            request.ThumbnailUrl
        );
        await _courseRepository.UpdateAsync(course);

        return BaseResponse<CourseResponse>.Ok(MapToResponse(course), "Course updated successfully");
    }

    public async Task<BaseResponse<CourseResponse>> GetCourseByIdAsync(Guid id)
    {
        var course = await _courseRepository.GetByIdAsync(id);
        if (course == null) return BaseResponse<CourseResponse>.Fail("Course not found");

        return BaseResponse<CourseResponse>.Ok(MapToResponse(course));
    }

    public async Task<BaseResponse<IEnumerable<CourseResponse>>> GetAllCoursesAsync()
    {
        var courses = await _courseRepository.GetAllAsync();
        var response = courses.Select(MapToResponse);
        return BaseResponse<IEnumerable<CourseResponse>>.Ok(response);
    }

    public async Task<BaseResponse<IEnumerable<CourseCatalogItemResponse>>> GetCatalogAsync(string? search, string? category, bool enrolledOnly)
    {
        var catalog = await _courseBrowseRepository.GetCatalogAsync(_currentUserService.UserId, search, category, enrolledOnly);
        return BaseResponse<IEnumerable<CourseCatalogItemResponse>>.Ok(catalog);
    }

    public async Task<BaseResponse<CourseDetailResponse>> GetCourseDetailAsync(Guid courseId)
    {
        var course = await _courseBrowseRepository.GetCourseDetailAsync(_currentUserService.UserId, courseId);
        if (course == null)
            return BaseResponse<CourseDetailResponse>.Fail("Course not found");

        return BaseResponse<CourseDetailResponse>.Ok(course);
    }

    private CourseResponse MapToResponse(Course course)
    {
        return new CourseResponse(
            course.Id,
            course.Title,
            course.Description,
            course.Category,
            course.EstimatedHours,
            course.ThumbnailUrl,
            course.InstructorId,
            course.Instructor?.FullName ?? "Unknown",
            course.LessonCount
        );
    }
}
