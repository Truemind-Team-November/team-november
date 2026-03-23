namespace LMS.Application.DTOs.Assignment;
public record CreateAssignmentRequest( Guid CourseId, string Title, string Description, DateTime DueDate);

public record UpdateAssignmentRequest(string Title, string Description, DateTime DueDate);

public record AssignmentResponse(Guid Id, Guid CourseId, string Title, string Description, DateTime DueDate, bool IsPastDue);

public record SubmitAssignmentRequest( Guid AssignmentId, string Answer);

public record SubmissionResponse(Guid Id, Guid AssignmentId, Guid UserId, string Answer, decimal? Score, DateTime SubmittedAt);

public record GradeSubmissionRequest(decimal Score);