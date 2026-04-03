using LMS.Domain.Entities;

namespace LMS.Application.Interfaces.Repositories;

public interface ICourseReviewRepository : IRepository<CourseReview>
{
    Task<CourseReview?> GetByUserAndCourseAsync(Guid userId, Guid courseId);
    Task<List<CourseReview>> GetByCourseIdAsync(Guid courseId);
}
