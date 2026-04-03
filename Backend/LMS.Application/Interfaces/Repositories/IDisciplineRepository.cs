using LMS.Domain.Entities;

namespace LMS.Application.Interfaces.Repositories;

public interface IDisciplineRepository : IRepository<Discipline>
{
    Task<bool> HasAnyAsync();
    Task<Discipline?> GetByNameAsync(string name);
    Task<Discipline?> GetByNameIncludingDeletedAsync(string name);
    Task<bool> ExistsByNameAsync(string name, Guid? excludedId = null);
}
