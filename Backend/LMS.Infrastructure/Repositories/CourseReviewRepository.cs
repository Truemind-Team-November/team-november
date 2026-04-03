using LMS.Application.Interfaces.Repositories;
using LMS.Domain.Entities;
using LMS.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace LMS.Infrastructure.Repositories;

public class CourseReviewRepository : ICourseReviewRepository
{
    private readonly ApplicationDbContext _context;

    public CourseReviewRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<CourseReview?> GetByIdAsync(Guid id)
    {
        return await _context.CourseReviews
            .Include(item => item.User)
            .Include(item => item.Course)
            .FirstOrDefaultAsync(item => item.Id == id);
    }

    public async Task<List<CourseReview>> GetAllAsync()
    {
        return await _context.CourseReviews
            .Include(item => item.User)
            .Include(item => item.Course)
            .ToListAsync();
    }

    public async Task<CourseReview?> GetByUserAndCourseAsync(Guid userId, Guid courseId)
    {
        return await _context.CourseReviews
            .Include(item => item.User)
            .Include(item => item.Course)
            .FirstOrDefaultAsync(item => item.UserId == userId && item.CourseId == courseId);
    }

    public async Task<List<CourseReview>> GetByCourseIdAsync(Guid courseId)
    {
        return await _context.CourseReviews
            .Include(item => item.User)
            .Where(item => item.CourseId == courseId)
            .OrderByDescending(item => item.UpdatedAt ?? item.CreatedAt)
            .ToListAsync();
    }

    public async Task AddAsync(CourseReview entity)
    {
        await _context.CourseReviews.AddAsync(entity);
        await _context.SaveChangesAsync();
    }

    public async Task UpdateAsync(CourseReview entity)
    {
        _context.CourseReviews.Update(entity);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(CourseReview entity)
    {
        _context.CourseReviews.Remove(entity);
        await _context.SaveChangesAsync();
    }
}
