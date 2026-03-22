using LMS.Application.Common;
using LMS.Application.DTOs.Course;

namespace LMS.Application.Interfaces.Services;

public interface ICourseService
{
    Task<BaseResponse<CourseResponse>> CreateCourseAsync(CreateCourseRequest request);
    Task<BaseResponse<CourseResponse>> UpdateCourseAsync(Guid id, UpdateCourseRequest request);
    Task<BaseResponse<CourseResponse>> GetCourseByIdAsync(Guid id);
    Task<BaseResponse<IEnumerable<CourseResponse>>> GetAllCoursesAsync();
}
