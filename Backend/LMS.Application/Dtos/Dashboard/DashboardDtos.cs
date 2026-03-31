namespace LMS.Application.DTOs.Dashboard;

public record DashboardMetricCardsResponse(
    int EnrolledCourses,
    double AverageCompletionPercentage,
    int PendingTasks,
    int Certificates
);

public record ContinueLearningItemResponse(
    Guid CourseId,
    string CourseTitle,
    string InstructorName,
    double ProgressPercentage,
    DateTime? LastActivityAt
);

public record UpcomingDeadlineResponse(
    Guid AssignmentId,
    string AssignmentTitle,
    string CourseTitle,
    DateTime DueDate,
    int DaysRemaining
);

public record RecentActivityResponse(
    string Type,
    string Description,
    DateTime OccurredAt
);

public record TeamPreviewMemberResponse(
    Guid UserId,
    string FullName,
    string Discipline,
    bool IsCurrentUser
);

public record TeamPreviewResponse(
    Guid TeamId,
    string TeamName,
    int MemberCount,
    IReadOnlyCollection<TeamPreviewMemberResponse> Members
);

public record InternIdentityCardResponse(
    string FullName,
    string PublicId,
    string Discipline,
    string Role,
    string? TeamName
);

public record DashboardResponse(
    string Greeting,
    string FullName,
    DashboardMetricCardsResponse Metrics,
    IReadOnlyCollection<ContinueLearningItemResponse> ContinueLearning,
    IReadOnlyCollection<UpcomingDeadlineResponse> UpcomingDeadlines,
    IReadOnlyCollection<RecentActivityResponse> RecentActivity,
    TeamPreviewResponse? MyTeam,
    InternIdentityCardResponse IdentityCard
);
