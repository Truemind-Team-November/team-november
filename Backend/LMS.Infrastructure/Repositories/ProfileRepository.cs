using LMS.Application.Common;
using LMS.Application.DTOs.Profile;
using LMS.Application.Interfaces.Repositories;
using LMS.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace LMS.Infrastructure.Repositories;

public class ProfileRepository : IProfileRepository
{
    private readonly ApplicationDbContext _context;

    public ProfileRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<UserProfileResponse?> GetProfileAsync(Guid userId)
    {
        var user = await _context.Users
            .AsNoTracking()
            .Include(item => item.Team)
            .FirstOrDefaultAsync(item => item.Id == userId);

        if (user == null)
            return null;

        var progresses = await _context.Progresses
            .AsNoTracking()
            .Where(item => item.UserId == userId)
            .ToListAsync();

        var certificatesCount = await _context.Certificates
            .AsNoTracking()
            .CountAsync(item => item.UserId == userId);

        var gradedSubmissions = await _context.Submissions
            .AsNoTracking()
            .Where(item => item.UserId == userId && item.Score.HasValue)
            .ToListAsync();

        var learningSummary = new LearningSummaryResponse(
            progresses.Select(item => item.CourseId).Distinct().Count(),
            progresses.Count == 0 ? 0 : Math.Round(progresses.Average(item => item.Percentage), 1),
            certificatesCount,
            gradedSubmissions.Count == 0 ? 0 : Math.Round(gradedSubmissions.Average(item => item.Score!.Value), 0)
        );

        var badges = BuildBadges(user);
        var achievements = await BuildAchievementsAsync(userId, learningSummary);

        return new UserProfileResponse(
            user.Id,
            user.FullName,
            user.PublicId,
            BuildHeadline(user),
            badges,
            new PersonalInformationResponse(
                user.FullName,
                user.Email,
                user.PhoneNumber
            ),
            learningSummary,
            achievements
        );
    }

    private static IReadOnlyCollection<ProfileBadgeResponse> BuildBadges(Domain.Entities.User user)
    {
        var badges = new List<ProfileBadgeResponse>
        {
            new(user.Discipline)
        };

        if (!string.IsNullOrWhiteSpace(user.CohortLabel))
            badges.Add(new ProfileBadgeResponse(user.CohortLabel));

        if (!string.IsNullOrWhiteSpace(user.Team?.Name))
            badges.Add(new ProfileBadgeResponse(user.Team.Name));

        return badges;
    }

    private async Task<IReadOnlyCollection<ProfileAchievementResponse>> BuildAchievementsAsync(
        Guid userId,
        LearningSummaryResponse learningSummary)
    {
        var activities = new List<DateTime>();

        activities.AddRange(await _context.LessonProgresses
            .AsNoTracking()
            .Where(item => item.UserId == userId && item.CompletedAt != null)
            .Select(item => item.CompletedAt!.Value)
            .ToListAsync());

        activities.AddRange(await _context.Submissions
            .AsNoTracking()
            .Where(item => item.UserId == userId)
            .Select(item => item.SubmittedAt)
            .ToListAsync());

        activities.AddRange(await _context.Certificates
            .AsNoTracking()
            .Where(item => item.UserId == userId)
            .Select(item => item.IssuedAt)
            .ToListAsync());

        var achievements = new List<ProfileAchievementResponse>();

        var distinctRecentDays = activities
            .Where(item => item >= DateTime.UtcNow.AddDays(-7))
            .Select(item => item.Date)
            .Distinct()
            .Count();

        if (distinctRecentDays >= 7)
        {
            achievements.Add(new ProfileAchievementResponse(
                "7-Day Streak",
                "Logged activity in 7 days in a row"
            ));
        }

        if (learningSummary.AverageScore >= 85)
        {
            achievements.Add(new ProfileAchievementResponse(
                "High Scorer",
                $"{learningSummary.AverageScore:0} average score across graded submissions"
            ));
        }

        if (learningSummary.Certificates > 0)
        {
            achievements.Add(new ProfileAchievementResponse(
                "Certified Learner",
                $"{learningSummary.Certificates} certificate(s) earned"
            ));
        }

        return achievements;
    }

    private static string BuildHeadline(Domain.Entities.User user)
    {
        var headlineParts = new List<string>
        {
            $"{user.Discipline} Intern"
        };

        if (!string.IsNullOrWhiteSpace(user.CohortLabel))
            headlineParts.Add(user.CohortLabel);

        if (!string.IsNullOrWhiteSpace(user.Location))
            headlineParts.Add(user.Location);

        return string.Join(" - ", headlineParts);
    }
}
