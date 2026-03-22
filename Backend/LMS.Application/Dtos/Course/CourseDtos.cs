namespace LMS.Application.DTOs.Course;

public record CreateCourseRequest(string Title, string Description, Guid InstructorId);
public record UpdateCourseRequest(string Title, string Description);
public record CourseResponse(Guid Id, string Title, string Description, Guid InstructorId, string InstructorName, int LessonCount);
