using LMS.Application.Interfaces.Repositories;
using LMS.Domain.Entities;
using LMS.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace LMS.Infrastructure.Repositories;

public class UserRepository : IUserRepository
{
    private readonly ApplicationDbContext _context;

    public UserRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<User?> GetByIdAsync(Guid id)
    {
        return await _context.Users
            .Include(user => user.Team)
            .FirstOrDefaultAsync(user => user.Id == id);
    }

    public async Task<List<User>> GetAllAsync()
    {
        return await _context.Users
            .Include(user => user.Team)
            .ToListAsync();
    }

    public async Task<List<User>> GetUnassignedLearnersAsync()
    {
        return await _context.Users
            .AsNoTracking()
            .Include(u => u.Team)
            .Where(u => u.Role == Domain.Enums.UserRole.Learner && u.TeamId == null)
            .OrderBy(u => u.FirstName)
            .ThenBy(u => u.LastName)
            .ToListAsync();
    }

    public async Task<List<User>> GetUsersByDisciplineAsync(string disciplineName)
    {
        if (string.IsNullOrWhiteSpace(disciplineName))
            return new List<User>();

        var normalized = disciplineName.Trim();

        return await _context.Users
            .AsNoTracking()
            .Include(u => u.Team)
            .Where(u => u.Discipline.ToLower() == normalized.ToLower())
            .ToListAsync();
    }

    public async Task<bool> ExistsByDisciplineAsync(string disciplineName)
    {
        if (string.IsNullOrWhiteSpace(disciplineName))
            return false;

        var normalized = disciplineName.Trim().ToLowerInvariant();

        return await _context.Users
            .AsNoTracking()
            .AnyAsync(u => u.Discipline.ToLower() == normalized);
    }

    public async Task<User?> GetByEmailAsync(string email)
    {
        return await _context.Users
            .Include(user => user.Team)
            .FirstOrDefaultAsync(u => u.Email == email.ToLower().Trim());
    }

    public async Task AddAsync(User entity)
    {
        await _context.Users.AddAsync(entity);
        await _context.SaveChangesAsync();
    }

    public async Task UpdateAsync(User entity)
    {
        _context.Users.Update(entity);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(User entity)
    {
        _context.Users.Remove(entity);
        await _context.SaveChangesAsync();
    }
}
