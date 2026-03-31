using LMS.Application.DTOs.Dashboard;
using LMS.Application.Interfaces.Repositories;
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
            .Include(item => item.Team!)
                .ThenInclude(team => team.Members)
            .FirstOrDefaultAsync(item => item.Id == userId);

        if (user == null)
            return null;

        var progresses = await _context.Progresses
            .AsNoTracking()
            .Where(item => item.UserId == userId)
            .Include(item => item.Course)
                .ThenInclude(course => course.Instructor)
            .ToListAsync();

        var enrolledCourseIds = progresses
            .Select(item => item.CourseId)
            .Distinct()
            .ToList();

        var enrolledCoursesCount = enrolledCourseIds.Count;
        var averageCompletion = enrolledCoursesCount == 0
            ? 0
            : Math.Round(progresses.Average(item => item.Percentage), 1);

        var certificatesCount = await _context.Certificates
            .AsNoTracking()
            .CountAsync(item => item.UserId == userId);

        var pendingTasksCount = await _context.Assignments
            .AsNoTracking()
            .Where(item => enrolledCourseIds.Contains(item.CourseId) && item.DueDate >= now)
            .Where(item => !_context.Submissions.Any(submission =>
                submission.AssignmentId == item.Id && submission.UserId == userId))
            .CountAsync();

        var continueLearning = progresses
            .Where(item => item.Percentage < 100)
            .OrderByDescending(item => item.UpdatedAt ?? item.CreatedAt)
            .Take(continueLearningLimit)
            .Select(item => new ContinueLearningItemResponse(
                item.CourseId,
                item.Course.Title,
                item.Course.Instructor?.FullName ?? "Unknown",
                Math.Round(item.Percentage, 1),
                item.UpdatedAt ?? item.CreatedAt
            ))
            .ToList();

        var upcomingDeadlines = await _context.Assignments
            .AsNoTracking()
            .Where(item => enrolledCourseIds.Contains(item.CourseId) && item.DueDate >= now)
            .Where(item => !_context.Submissions.Any(submission =>
                submission.AssignmentId == item.Id && submission.UserId == userId))
            .OrderBy(item => item.DueDate)
            .Include(item => item.Course)
            .Take(deadlineLimit)
            .Select(item => new UpcomingDeadlineResponse(
                item.Id,
                item.Title,
                item.Course.Title,
                item.DueDate,
                Math.Max(0, (int)Math.Ceiling((item.DueDate - now).TotalDays))
            ))
            .ToListAsync();

        var lessonActivities = await _context.LessonProgresses
            .AsNoTracking()
            .Where(item => item.UserId == userId && item.CompletedAt != null)
            .Include(item => item.Lesson)
                .ThenInclude(lesson => lesson.Course)
            .Select(item => new RecentActivityResponse(
                "lesson_completed",
                $"You completed lesson {item.Lesson.Title} in {item.Lesson.Course.Title}",
                item.CompletedAt!.Value
            ))
            .ToListAsync();

        var submissionActivities = await _context.Submissions
            .AsNoTracking()
            .Where(item => item.UserId == userId)
            .Include(item => item.Assignment)
            .Select(item => new RecentActivityResponse(
                "assignment_submitted",
                $"You submitted {item.Assignment.Title}",
                item.SubmittedAt
            ))
            .ToListAsync();

        var certificateActivities = await _context.Certificates
            .AsNoTracking()
            .Where(item => item.UserId == userId)
            .Include(item => item.Course)
            .Select(item => new RecentActivityResponse(
                "certificate_earned",
                $"You earned a certificate in {item.Course.Title}",
                item.IssuedAt
            ))
            .ToListAsync();

        var enrollmentActivities = await _context.Enrollments
            .AsNoTracking()
            .Where(item => item.UserId == userId)
            .Include(item => item.Course)
            .Select(item => new RecentActivityResponse(
                "course_joined",
                $"You enrolled in {item.Course.Title}",
                item.EnrolledAt
            ))
            .ToListAsync();

        var recentActivity = lessonActivities
            .Concat(submissionActivities)
            .Concat(certificateActivities)
            .Concat(enrollmentActivities)
            .OrderByDescending(item => item.OccurredAt)
            .Take(activityLimit)
            .ToList();

        TeamPreviewResponse? myTeam = null;
        if (user.Team != null)
        {
            var orderedMembers = user.Team.Members
                .OrderByDescending(member => member.Id == userId)
                .ThenBy(member => member.FirstName)
                .ThenBy(member => member.LastName)
                .ToList();

            myTeam = new TeamPreviewResponse(
                user.Team.Id,
                user.Team.Name,
                orderedMembers.Count,
                orderedMembers
                    .Take(teamMemberPreviewLimit)
                    .Select(member => new TeamPreviewMemberResponse(
                        member.Id,
                        member.FullName,
                        member.Discipline,
                        member.Id == userId
                    ))
                    .ToList()
            );
        }

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
                user.Role.ToString(),
                user.Team?.Name
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
}
