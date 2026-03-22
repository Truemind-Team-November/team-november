
using LMS.Domain.Enums;

namespace LMS.Application.DTOs.Lesson;

public record CreateLessonRequest(Guid CourseId, string Title, int Order);
public record AddLessonContentRequest(Guid LessonId, ContentType ContentType, string? ContentUrl, string? TextContent);
public record LessonResponse(Guid Id, Guid CourseId, string Title, int Order, int ContentCount);
