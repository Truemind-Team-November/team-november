
using LMS.Domain.Enums;

namespace LMS.Application.DTOs.Lesson;

public record CreateLessonRequest(Guid CourseId, string Title, int Order);
public record AddLessonContentRequest(Guid LessonId, ContentType ContentType, string? ContentUrl, string? TextContent);
public record LessonResponse(Guid Id, Guid CourseId, string Title, int Order, int ContentCount);
public record SaveLessonNoteRequest(string Content);
public record LessonPlayerContentResponse(Guid Id, ContentType ContentType, string? Url, string? TextContent);
public record LessonPlayerSidebarItemResponse(Guid LessonId, string Title, int Order, bool IsCompleted, bool IsLocked, bool IsCurrent);
public record LessonNoteResponse(Guid Id, string Content, DateTime UpdatedAt);
public record LessonPlayerResponse(
    Guid CourseId,
    string CourseTitle,
    Guid LessonId,
    string LessonTitle,
    int LessonOrder,
    double ProgressPercentage,
    bool IsCompleted,
    Guid? PreviousLessonId,
    Guid? NextLessonId,
    IReadOnlyCollection<LessonPlayerContentResponse> Contents,
    IReadOnlyCollection<LessonPlayerSidebarItemResponse> SidebarLessons,
    LessonNoteResponse? Note
);
