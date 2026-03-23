using LMS.Application.Common;
using LMS.Application.DTOs.Lesson;
using LMS.Application.Interfaces.Repositories;
using LMS.Application.Interfaces.Services;
using LMS.Domain.Entities;
using LMS.Domain.Enums;

namespace LMS.Application.Services;

public class LessonService : ILessonService
{
    private readonly ILessonRepository _lessonRepository;
    private readonly ICourseRepository _courseRepository;
    private readonly IUnitOfWork _unitOfWork;

    public LessonService(ILessonRepository lessonRepository, ICourseRepository courseRepository, IUnitOfWork unitOfWork)
    {
        _lessonRepository = lessonRepository;
        _courseRepository = courseRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<BaseResponse<LessonResponse>> CreateLessonAsync(CreateLessonRequest request)
    {
        var course = await _courseRepository.GetByIdAsync(request.CourseId);
        if (course == null) return BaseResponse<LessonResponse>.Fail("Course not found");

        var lesson = Lesson.Create(request.CourseId, request.Title, request.Order);
        await _lessonRepository.AddAsync(lesson);
        await _unitOfWork.SaveChangesAsync();

        return BaseResponse<LessonResponse>.Ok(MapToResponse(lesson), "Lesson created successfully");
    }

    public async Task<BaseResponse<LessonResponse>> AddContentAsync(AddLessonContentRequest request)
    {
        var lesson = await _lessonRepository.GetByIdAsync(request.LessonId);
        if (lesson == null)
        {
            return BaseResponse<LessonResponse>.Fail("Lesson not found");

        }

        if (request.ContentType != ContentType.Text && string.IsNullOrWhiteSpace(request.ContentUrl))
        {
            return BaseResponse<LessonResponse>.Fail("Content URL is required");
        }

        if (request.ContentType == ContentType.Text && string.IsNullOrWhiteSpace(request.TextContent))
        {
            return BaseResponse<LessonResponse>.Fail("Text content is required");
        }

        LessonContent content = request.ContentType switch
        {
            ContentType.Video => LessonContent.CreateVideo(request.LessonId, request.ContentUrl!),
            ContentType.Pdf => LessonContent.CreatePdf(request.LessonId, request.ContentUrl!),
            ContentType.Text => LessonContent.CreateText(request.LessonId, request.TextContent!),
            _ => throw new ArgumentException("Invalid content type")
        };

        lesson.AddContent(content);
        await _unitOfWork.SaveChangesAsync();

        return BaseResponse<LessonResponse>.Ok(MapToResponse(lesson), "Content added successfully");
    }

    public async Task<BaseResponse<IEnumerable<LessonResponse>>> GetLessonsByCourseIdAsync(Guid courseId)
    {
       
        var lessons = await _lessonRepository.GetByCourseIdAsync(courseId);
        if (lessons.Count == 0)
        {
            return BaseResponse<IEnumerable<LessonResponse>>.Fail("No lessons found for this course");
        }
        var response = lessons.Select(MapToResponse).ToList();
        return BaseResponse<IEnumerable<LessonResponse>>.Ok(response);
    }

    private LessonResponse MapToResponse(Lesson lesson)
    {
        return new LessonResponse(
            lesson.Id,
            lesson.CourseId,
            lesson.Title,
            lesson.Order,
            lesson.ContentCount
        );
    }
}
