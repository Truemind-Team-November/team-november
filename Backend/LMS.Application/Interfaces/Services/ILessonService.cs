using LMS.Application.Common;
using LMS.Application.DTOs.Lesson;

namespace LMS.Application.Interfaces.Services;

public interface ILessonService
{
    Task<BaseResponse<LessonResponse>> CreateLessonAsync(CreateLessonRequest request);
    Task<BaseResponse<LessonResponse>> AddContentAsync(AddLessonContentRequest request);
    Task<BaseResponse<IEnumerable<LessonResponse>>> GetLessonsByCourseIdAsync(Guid courseId);
}
