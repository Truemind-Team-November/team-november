namespace LMS.Application.DTOs.Progress;

public record CompleteLessonRequest(Guid UserId, Guid LessonId);
public record ProgressResponse(Guid UserId, Guid CourseId, int TotalLessons, int CompletedLessons, double Percentage);
