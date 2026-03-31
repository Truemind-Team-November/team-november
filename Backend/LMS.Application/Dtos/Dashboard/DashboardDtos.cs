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
    string? CohortLabel,
    string? Location,
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

public record AdminDashboardMetricCardsResponse(
    int TotalUsers,
    int TotalLearners,
    int TotalInstructors,
    int TotalAdmins,
    int PendingInstructorRequests,
    int TotalTeams,
    int TotalCourses,
    int TotalAssignments,
    int TotalSubmissions,
    int TotalCertificates,
    int TotalDiscussionPosts
);

public record AdminRecentActivityResponse(
    string Type,
    string Description,
    DateTime OccurredAt
);

public record AdminDashboardResponse(
    string Greeting,
    string FullName,
    AdminDashboardMetricCardsResponse Metrics,
    IReadOnlyCollection<AdminRecentActivityResponse> RecentActivity
);
