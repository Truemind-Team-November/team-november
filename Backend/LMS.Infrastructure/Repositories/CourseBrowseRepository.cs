using LMS.Application.DTOs.Course;
using LMS.Application.Interfaces.Repositories;
using LMS.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace LMS.Infrastructure.Repositories;

public class CourseBrowseRepository : ICourseBrowseRepository
{
    private readonly ApplicationDbContext _context;

    public CourseBrowseRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<CourseCatalogItemResponse>> GetCatalogAsync(Guid? userId, string? search, string? category, bool enrolledOnly)
    {
        var normalizedSearch = search?.Trim().ToLowerInvariant();
        var normalizedCategory = category?.Trim().ToLowerInvariant();

        var courses = await _context.Courses
            .AsNoTracking()
            .Include(course => course.Instructor)
            .Include(course => course.Lessons)
            .ToListAsync();

        var progresses = userId.HasValue
            ? await _context.Progresses
                .AsNoTracking()
                .Where(item => item.UserId == userId.Value)
                .ToListAsync()
            : [];

        var reviewSummaries = await _context.CourseReviews
            .AsNoTracking()
            .GroupBy(item => item.CourseId)
            .Select(group => new
            {
                CourseId = group.Key,
                AverageRating = group.Average(item => item.Rating),
                ReviewCount = group.Count()
            })
            .ToListAsync();

        var progressByCourseId = progresses.ToDictionary(item => item.CourseId);
        var reviewsByCourseId = reviewSummaries.ToDictionary(item => item.CourseId);

        var query = courses.AsEnumerable();

        if (!string.IsNullOrWhiteSpace(normalizedSearch))
        {
            query = query.Where(course =>
                course.Title.Contains(normalizedSearch, StringComparison.OrdinalIgnoreCase) ||
                course.Description.Contains(normalizedSearch, StringComparison.OrdinalIgnoreCase));
        }

        if (!string.IsNullOrWhiteSpace(normalizedCategory))
        {
            query = query.Where(course =>
                string.Equals(course.Category, normalizedCategory, StringComparison.OrdinalIgnoreCase));
        }

        if (enrolledOnly)
        {
            query = query.Where(course => progressByCourseId.ContainsKey(course.Id));
        }

        return query
            .OrderBy(course => course.Title)
            .Select(course =>
            {
                var progress = progressByCourseId.GetValueOrDefault(course.Id);
                return new CourseCatalogItemResponse(
                    course.Id,
                    course.Title,
                    course.Description,
                    course.Category,
                    course.EstimatedHours,
                    course.ThumbnailUrl,
                    course.Instructor?.FullName ?? "Unknown",
                    course.Lessons.Count,
                    reviewsByCourseId.TryGetValue(course.Id, out var reviewSummary)
                        ? Math.Round((decimal)reviewSummary.AverageRating, 1)
                        : 0,
                    reviewSummary?.ReviewCount ?? 0,
                    progress != null,
                    progress?.Percentage >= 100,
                    Math.Round(progress?.Percentage ?? 0, 1)
                );
            })
            .ToList();
    }

    public async Task<CourseDetailResponse?> GetCourseDetailAsync(Guid? userId, Guid courseId)
    {
        var course = await _context.Courses
            .AsNoTracking()
            .Include(item => item.Instructor)
            .Include(item => item.Lessons)
                .ThenInclude(lesson => lesson.Contents)
            .FirstOrDefaultAsync(item => item.Id == courseId);

        if (course == null)
            return null;

        var progress = userId.HasValue
            ? await _context.Progresses.AsNoTracking().FirstOrDefaultAsync(item => item.UserId == userId.Value && item.CourseId == courseId)
            : null;

        var completedLessonIds = userId.HasValue
            ? await _context.LessonProgresses
                .AsNoTracking()
                .Where(item => item.UserId == userId.Value && item.Lesson.CourseId == courseId && item.IsCompleted)
                .Select(item => item.LessonId)
                .ToListAsync()
            : [];

        var assignmentsCount = await _context.Assignments
            .AsNoTracking()
            .CountAsync(item => item.CourseId == courseId);

        var reviewSummary = await _context.CourseReviews
            .AsNoTracking()
            .Where(item => item.CourseId == courseId)
            .GroupBy(item => item.CourseId)
            .Select(group => new
            {
                AverageRating = group.Average(item => item.Rating),
                ReviewCount = group.Count()
            })
            .FirstOrDefaultAsync();

        var instructorRoleRequest = await _context.InstructorRoleRequests
            .AsNoTracking()
            .Where(item => item.UserId == course.InstructorId && item.Status == LMS.Domain.Enums.RoleRequestStatus.Approved)
            .OrderByDescending(item => item.UpdatedAt ?? item.CreatedAt)
            .FirstOrDefaultAsync();

        var orderedLessons = course.Lessons
            .OrderBy(item => item.Order)
            .ToList();

        var firstIncompleteLesson = orderedLessons.FirstOrDefault(item => !completedLessonIds.Contains(item.Id));

        var modules = orderedLessons
            .Select(lesson =>
            {
                var isCompleted = completedLessonIds.Contains(lesson.Id);
                var hasIncompleteBefore = orderedLessons
                    .Where(item => item.Order < lesson.Order)
                    .Any(item => !completedLessonIds.Contains(item.Id));

                return new CourseModuleResponse(
                    lesson.Id,
                    lesson.Title,
                    lesson.Description,
                    lesson.Order,
                    lesson.EstimatedMinutes,
                    isCompleted,
                    hasIncompleteBefore && !isCompleted,
                    firstIncompleteLesson?.Id == lesson.Id,
                    lesson.Contents.Count
                );
            })
            .ToList();

        var includes = new CourseIncludesResponse(
            course.Lessons.Count,
            course.Lessons.SelectMany(item => item.Contents).Count(item => item.ContentType == LMS.Domain.Enums.ContentType.Pdf),
            assignmentsCount,
            true,
            true
        );

        return new CourseDetailResponse(
            course.Id,
            course.Title,
            course.Description,
            course.Category,
            course.EstimatedHours,
            course.ThumbnailUrl,
            new CourseInstructorResponse(
                course.InstructorId,
                course.Instructor?.FullName ?? "Unknown",
                course.Instructor?.ProfileImageUrl,
                string.IsNullOrWhiteSpace(course.Instructor?.Discipline) ? "Instructor" : $"{course.Instructor.Discipline} Instructor",
                instructorRoleRequest?.Bio
            ),
            Math.Round(progress?.Percentage ?? 0, 1),
            reviewSummary == null ? 0 : Math.Round((decimal)reviewSummary.AverageRating, 1),
            reviewSummary?.ReviewCount ?? 0,
            progress != null,
            course.Lessons.Count,
            includes,
            modules,
            firstIncompleteLesson?.Id
        );
    }

    public async Task<IReadOnlyCollection<CourseReviewResponse>> GetCourseReviewsAsync(Guid courseId)
    {
        return await _context.CourseReviews
            .AsNoTracking()
            .Include(item => item.User)
            .Where(item => item.CourseId == courseId)
            .OrderByDescending(item => item.UpdatedAt ?? item.CreatedAt)
            .Select(item => new CourseReviewResponse(
                item.Id,
                item.CourseId,
                item.UserId,
                item.User.FullName,
                item.User.PublicId,
                item.Rating,
                item.Comment,
                item.UpdatedAt ?? item.CreatedAt))
            .ToListAsync();
    }
}
