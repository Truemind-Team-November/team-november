using LMS.Application.DTOs.Dashboard;
using LMS.Application.Interfaces.Repositories;
using LMS.Domain.Entities;
using LMS.Domain.Enums;
using LMS.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace LMS.Infrastructure.Repositories;

public class DashboardRepository : IDashboardRepository
{
    private readonly ApplicationDbContext _context;

    public DashboardRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<DashboardResponse?> GetDashboardAsync(
        Guid userId,
        int continueLearningLimit = 3,
        int deadlineLimit = 3,
        int activityLimit = 5,
        int teamMemberPreviewLimit = 3
    )
    {
        var now = DateTime.UtcNow;

        var user = await _context.Users
            .AsNoTracking()
            .FirstOrDefaultAsync(item => item.Id == userId);

        if (user == null)
            return null;

        // Load team preview (project only required fields) to avoid full entity tracking
        TeamPreviewResponse? myTeam = null;
        if (user.TeamId.HasValue)
        {
            var teamPreview = await _context.Teams
                .AsNoTracking()
                .Where(t => t.Id == user.TeamId.Value)
                .Select(t => new
                {
                    t.Id,
                    t.Name,
                    MemberCount = t.Members.Count,
                    Members = t.Members
                        .OrderByDescending(m => m.Id == userId)
                        .ThenBy(m => m.FirstName)
                        .ThenBy(m => m.LastName)
                        .Select(m => new TeamPreviewMemberResponse(
                            m.Id,
                            m.FullName,
                            m.Discipline,
                            m.Id == userId
                        ))
                        .Take(teamMemberPreviewLimit)
                        .ToList()
                })
                .FirstOrDefaultAsync();

            if (teamPreview != null)
            {
                myTeam = new TeamPreviewResponse(
                    teamPreview.Id,
                    teamPreview.Name,
                    teamPreview.MemberCount,
                    teamPreview.Members
                );
            }
        }

        // Load progress entries but project only the required fields to reduce joins
        var progresses = await _context.Progresses
            .AsNoTracking()
            .Where(p => p.UserId == userId)
            .Select(p => new
            {
                p.CourseId,
                Percentage = p.Percentage,
                LastActivity = p.UpdatedAt ?? p.CreatedAt,
                CourseTitle = p.Course != null ? p.Course.Title : null,
                InstructorName = p.Course != null && p.Course.Instructor != null ? p.Course.Instructor.FullName : null
            })
            .ToListAsync();

        var enrolledCourseIds = progresses
            .Select(p => p.CourseId)
            .Distinct()
            .ToList();

        var enrolledCoursesCount = enrolledCourseIds.Count;
        var averageCompletion = enrolledCoursesCount == 0
            ? 0
            : Math.Round(progresses.Average(p => p.Percentage), 1);

        var certificatesCount = await _context.Certificates
            .AsNoTracking()
            .CountAsync(item => item.UserId == userId);

        var pendingTasksCount = 0;
        if (enrolledCourseIds.Count > 0)
        {
            pendingTasksCount = await _context.Assignments
                .AsNoTracking()
                .Where(item => enrolledCourseIds.Contains(item.CourseId) && item.DueDate >= now)
                .Where(item => !_context.Submissions.Any(submission => submission.AssignmentId == item.Id && submission.UserId == userId))
                .CountAsync();
        }

        var continueLearning = progresses
            .Where(item => item.Percentage < 100 && !string.IsNullOrWhiteSpace(item.CourseTitle))
            .OrderByDescending(item => item.LastActivity)
            .Take(continueLearningLimit)
            .Select(item => new ContinueLearningItemResponse(
                item.CourseId,
                item.CourseTitle ?? "Unknown",
                item.InstructorName ?? "Unknown",
                Math.Round(item.Percentage, 1),
                item.LastActivity
            ))
            .ToList();

        var upcomingDeadlines = new List<UpcomingDeadlineResponse>();
        if (enrolledCourseIds.Count > 0)
        {
            upcomingDeadlines = await _context.Assignments
                .AsNoTracking()
                .Where(item => enrolledCourseIds.Contains(item.CourseId) && item.DueDate >= now)
                .Where(item => !_context.Submissions.Any(submission => submission.AssignmentId == item.Id && submission.UserId == userId))
                .OrderBy(item => item.DueDate)
                .Take(deadlineLimit)
                .Select(item => new UpcomingDeadlineResponse(
                    item.Id,
                    item.Title,
                    item.Course != null ? item.Course.Title : string.Empty,
                    item.DueDate,
                    Math.Max(0, (int)Math.Ceiling((item.DueDate - now).TotalDays))
                ))
                .ToListAsync();
        }

        // Recent activity: use projections directly from each source
        var lessonActivities = await _context.LessonProgresses
            .AsNoTracking()
            .Where(item => item.UserId == userId && item.CompletedAt != null)
            .Select(item => new RecentActivityResponse(
                "lesson_completed",
                item.Lesson != null && item.Lesson.Course != null ? $"You completed lesson {item.Lesson.Title} in {item.Lesson.Course.Title}" : "",
                item.CompletedAt!.Value
            ))
            .ToListAsync();

        var submissionActivities = await _context.Submissions
            .AsNoTracking()
            .Where(item => item.UserId == userId && item.Assignment != null)
            .Select(item => new RecentActivityResponse(
                "assignment_submitted",
                $"You submitted {item.Assignment.Title}",
                item.SubmittedAt
            ))
            .ToListAsync();

        var certificateActivities = await _context.Certificates
            .AsNoTracking()
            .Where(item => item.UserId == userId && item.Course != null)
            .Select(item => new RecentActivityResponse(
                "certificate_earned",
                $"You earned a certificate in {item.Course.Title}",
                item.IssuedAt
            ))
            .ToListAsync();

        var discussionPostActivities = await _context.DiscussionPosts
            .AsNoTracking()
            .Where(item => item.UserId == userId)
            .Select(item => new RecentActivityResponse(
                "discussion_posted",
                $"You started the discussion {item.Title}",
                item.CreatedAt
            ))
            .ToListAsync();

        var discussionReplyActivities = await _context.DiscussionReplies
            .AsNoTracking()
            .Where(item => item.UserId == userId && item.Post != null)
            .Select(item => new RecentActivityResponse(
                "discussion_replied",
                $"You replied to {item.Post.Title}",
                item.CreatedAt
            ))
            .ToListAsync();

        var enrollmentActivities = await _context.Enrollments
            .AsNoTracking()
            .Where(item => item.UserId == userId && item.Course != null)
            .Select(item => new RecentActivityResponse(
                "course_joined",
                $"You enrolled in {item.Course.Title}",
                item.EnrolledAt
            ))
            .ToListAsync();

        var recentActivity = lessonActivities
            .Concat(submissionActivities)
            .Concat(certificateActivities)
            .Concat(discussionPostActivities)
            .Concat(discussionReplyActivities)
            .Concat(enrollmentActivities)
            .OrderByDescending(item => item.OccurredAt)
            .Take(activityLimit)
            .ToList();

        return new DashboardResponse(
            GetGreeting(now),
            user.FullName,
            new DashboardMetricCardsResponse(
                enrolledCoursesCount,
                averageCompletion,
                pendingTasksCount,
                certificatesCount
            ),
            continueLearning,
            upcomingDeadlines,
            recentActivity,
            myTeam,
            new InternIdentityCardResponse(
                user.FullName,
                user.PublicId,
                user.Discipline,
                user.CohortLabel,
                user.Location,
                user.Role.ToString(),
                myTeam?.TeamName
            )
        );
    }

    private static string GetGreeting(DateTime now)
    {
        var hour = now.Hour;

        if (hour < 12)
            return "Good morning";

        if (hour < 17)
            return "Good afternoon";

        return "Good evening";
    }

    public async Task<AdminDashboardResponse?> GetAdminDashboardAsync(Guid userId, int activityLimit = 8)
    {
        var now = DateTime.UtcNow;

        var user = await _context.Users
            .AsNoTracking()
            .FirstOrDefaultAsync(item => item.Id == userId);

        if (user == null)
            return null;

        var totalUsers = await _context.Users.AsNoTracking().CountAsync();
        var totalLearners = await _context.Users.AsNoTracking().CountAsync(x => x.Role == UserRole.Learner);
        var totalInstructors = await _context.Users.AsNoTracking().CountAsync(x => x.Role == UserRole.Instructor);
        var totalAdmins = await _context.Users.AsNoTracking().CountAsync(x => x.Role == UserRole.Admin);
        var pendingInstructorRequests = await _context.InstructorRoleRequests.AsNoTracking().CountAsync(x => x.Status == RoleRequestStatus.Pending);
        var totalTeams = await _context.Teams.AsNoTracking().CountAsync();
        var totalCourses = await _context.Courses.AsNoTracking().CountAsync();
        var totalAssignments = await _context.Assignments.AsNoTracking().CountAsync();
        var totalSubmissions = await _context.Submissions.AsNoTracking().CountAsync();
        var totalCertificates = await _context.Certificates.AsNoTracking().CountAsync();
        var totalDiscussionPosts = await _context.DiscussionPosts.AsNoTracking().CountAsync();

        var userActivities = await _context.Users
            .AsNoTracking()
            .OrderByDescending(x => x.CreatedAt)
            .Take(activityLimit)
            .Select(x => new AdminRecentActivityResponse(
                "user_registered",
                $"New user registered: {x.FullName}",
                x.CreatedAt))
            .ToListAsync();

        var roleRequestActivities = await _context.InstructorRoleRequests
            .AsNoTracking()
            .Include(x => x.User)
            .OrderByDescending(x => x.CreatedAt)
            .Take(activityLimit)
            .Select(x => new AdminRecentActivityResponse(
                "role_request",
                $"{x.User.FullName} submitted an instructor role request",
                x.CreatedAt))
            .ToListAsync();

        var courseActivities = await _context.Courses
            .AsNoTracking()
            .OrderByDescending(x => x.CreatedAt)
            .Take(activityLimit)
            .Select(x => new AdminRecentActivityResponse(
                "course_created",
                $"New course created: {x.Title}",
                x.CreatedAt))
            .ToListAsync();

        var discussionActivities = await _context.DiscussionPosts
            .AsNoTracking()
            .Include(x => x.User)
            .OrderByDescending(x => x.CreatedAt)
            .Take(activityLimit)
            .Select(x => new AdminRecentActivityResponse(
                "discussion_posted",
                $"{x.User.FullName} started a discussion: {x.Title}",
                x.CreatedAt))
            .ToListAsync();

        var recentActivity = userActivities
            .Concat(roleRequestActivities)
            .Concat(courseActivities)
            .Concat(discussionActivities)
            .OrderByDescending(x => x.OccurredAt)
            .Take(activityLimit)
            .ToList();

        return new AdminDashboardResponse(
            GetGreeting(now),
            user.FullName,
            new AdminDashboardMetricCardsResponse(
                totalUsers,
                totalLearners,
                totalInstructors,
                totalAdmins,
                pendingInstructorRequests,
                totalTeams,
                totalCourses,
                totalAssignments,
                totalSubmissions,
                totalCertificates,
                totalDiscussionPosts
            ),
            recentActivity
        );
    }

    public async Task<InstructorDashboardResponse?> GetInstructorDashboardAsync(
        Guid userId,
        int courseLimit = 6,
        int reviewLimit = 8,
        int activityLimit = 8)
    {
        var now = DateTime.UtcNow;

        var user = await _context.Users
            .AsNoTracking()
            .FirstOrDefaultAsync(item => item.Id == userId);

        if (user == null)
            return null;

        var courses = await _context.Courses
            .AsNoTracking()
            .Where(item => item.InstructorId == userId)
            .Include(item => item.Lessons)
            .Include(item => item.Assignments)
            .Include(item => item.Enrollments)
            .OrderByDescending(item => item.CreatedAt)
            .ToListAsync();

        var courseIds = courses.Select(item => item.Id).ToList();

        var submissions = await _context.Submissions
            .AsNoTracking()
            .Where(item => courseIds.Contains(item.Assignment.CourseId))
            .Include(item => item.Assignment)
                .ThenInclude(assignment => assignment.Course)
            .Include(item => item.User)
            .ToListAsync();

        var totalCourses = courses.Count;
        var totalLessons = courses.Sum(item => item.Lessons.Count);
        var totalAssignments = courses.Sum(item => item.Assignments.Count);
        var totalSubmissions = submissions.Count;
        var pendingGrading = submissions.Count(item => !item.Score.HasValue);
        var totalLearners = courses
            .SelectMany(item => item.Enrollments)
            .Select(item => item.UserId)
            .Distinct()
            .Count();

        var courseOverview = courses
            .Take(courseLimit)
            .Select(item => new InstructorCourseOverviewResponse(
                item.Id,
                item.Title,
                item.Category,
                item.Lessons.Count,
                item.Assignments.Count,
                item.Enrollments.Select(x => x.UserId).Distinct().Count()
            ))
            .ToList();

        var pendingReviews = submissions
            .Where(item => !item.Score.HasValue)
            .OrderByDescending(item => item.SubmittedAt)
            .Take(reviewLimit)
            .Select(item => new InstructorSubmissionReviewResponse(
                item.Id,
                item.AssignmentId,
                item.Assignment.Title,
                item.Assignment.Course.Title,
                item.User.FullName,
                item.SubmittedAt
            ))
            .ToList();

        var courseActivities = courses
            .Select(item => new InstructorRecentActivityResponse(
                "course_created",
                $"You created the course {item.Title}",
                item.CreatedAt
            ));

        var lessonActivities = await _context.Lessons
            .AsNoTracking()
            .Where(item => courseIds.Contains(item.CourseId))
            .Include(item => item.Course)
            .Select(item => new InstructorRecentActivityResponse(
                "lesson_created",
                $"Lesson {item.Title} was added to {item.Course.Title}",
                item.CreatedAt
            ))
            .ToListAsync();

        var assignmentActivities = await _context.Assignments
            .AsNoTracking()
            .Where(item => courseIds.Contains(item.CourseId))
            .Include(item => item.Course)
            .Select(item => new InstructorRecentActivityResponse(
                "assignment_created",
                $"Assignment {item.Title} was created for {item.Course.Title}",
                item.CreatedAt
            ))
            .ToListAsync();

        var submissionActivities = submissions
            .Select(item => new InstructorRecentActivityResponse(
                "submission_received",
                $"{item.User.FullName} submitted {item.Assignment.Title}",
                item.SubmittedAt
            ));

        var recentActivity = courseActivities
            .Concat(lessonActivities)
            .Concat(assignmentActivities)
            .Concat(submissionActivities)
            .OrderByDescending(item => item.OccurredAt)
            .Take(activityLimit)
            .ToList();

        return new InstructorDashboardResponse(
            GetGreeting(now),
            user.FullName,
            new InstructorDashboardMetricCardsResponse(
                totalCourses,
                totalLessons,
                totalAssignments,
                totalSubmissions,
                pendingGrading,
                totalLearners
            ),
            courseOverview,
            pendingReviews,
            recentActivity
        );
    }
}
