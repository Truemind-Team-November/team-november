using LMS.Domain.Entities;

namespace LMS.Application.Interfaces.Repositories;

public interface IUserRepository : IRepository<User>
{
    Task<User?> GetByEmailAsync(string email);
    Task<List<User>> GetAllAsync();
    Task<List<User>> GetUnassignedLearnersAsync();
    Task<List<User>> GetUsersByDisciplineAsync(string disciplineName);
    Task<bool> ExistsByDisciplineAsync(string disciplineName);
}
