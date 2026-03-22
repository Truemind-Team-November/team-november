using LMS.Application.Common;
using LMS.Application.DTOs.Course;
using LMS.Application.Interfaces.Repositories;
using LMS.Application.Interfaces.Services;
using LMS.Domain.Entities;

namespace LMS.Application.Services;

public class CourseService : ICourseService
{
    private readonly ICourseRepository _courseRepository;

    public CourseService(ICourseRepository courseRepository)
    {
        _courseRepository = courseRepository;
    }

    public async Task<BaseResponse<CourseResponse>> CreateCourseAsync(CreateCourseRequest request)
    {
        var course = Course.Create(request.Title, request.Description, request.InstructorId);
        await _courseRepository.AddAsync(course);

        var response = MapToResponse(course);
        return BaseResponse<CourseResponse>.Ok(response, "Course created successfully");
    }

    public async Task<BaseResponse<CourseResponse>> UpdateCourseAsync(Guid id, UpdateCourseRequest request)
    {
        var course = await _courseRepository.GetByIdAsync(id);
        if (course == null) return BaseResponse<CourseResponse>.Fail("Course not found");

        course.UpdateDetails(request.Title, request.Description);
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

    private CourseResponse MapToResponse(Course course)
    {
        return new CourseResponse(
            course.Id,
            course.Title,
            course.Description,
            course.InstructorId,
            course.Instructor?.FullName ?? "Unknown",
            course.LessonCount
        );
    }
}
