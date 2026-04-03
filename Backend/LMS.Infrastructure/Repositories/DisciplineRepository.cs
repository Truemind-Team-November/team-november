using LMS.Application.Interfaces.Repositories;
using LMS.Domain.Entities;
using LMS.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace LMS.Infrastructure.Repositories;

public class DisciplineRepository : IDisciplineRepository
{
    private readonly ApplicationDbContext _context;

    public DisciplineRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Discipline?> GetByIdAsync(Guid id)
    {
        return await _context.Disciplines
            .FirstOrDefaultAsync(discipline => discipline.Id == id);
    }

    public async Task<List<Discipline>> GetAllAsync()
    {
        return await _context.Disciplines.ToListAsync();
    }

    public async Task<bool> HasAnyAsync()
    {
        return await _context.Disciplines.AnyAsync();
    }

    public async Task<Discipline?> GetByNameAsync(string name)
    {
        if (string.IsNullOrWhiteSpace(name))
            return null;

        var normalizedName = name.Trim().ToLowerInvariant();

        return await _context.Disciplines
            .FirstOrDefaultAsync(discipline => discipline.Name.ToLower() == normalizedName);
    }

    public async Task<Discipline?> GetByNameIncludingDeletedAsync(string name)
    {
        if (string.IsNullOrWhiteSpace(name))
            return null;

        var normalizedName = name.Trim().ToLowerInvariant();

        return await _context.Disciplines
            .IgnoreQueryFilters()
            .FirstOrDefaultAsync(discipline => discipline.Name.ToLower() == normalizedName);
    }

    public async Task<bool> ExistsByNameAsync(string name, Guid? excludedId = null)
    {
        if (string.IsNullOrWhiteSpace(name))
            return false;

        var normalizedName = name.Trim().ToLowerInvariant();

        return await _context.Disciplines.AnyAsync(discipline =>
            discipline.Name.ToLower() == normalizedName &&
            (!excludedId.HasValue || discipline.Id != excludedId.Value));
    }

    public async Task AddAsync(Discipline entity)
    {
        await _context.Disciplines.AddAsync(entity);
        await _context.SaveChangesAsync();
    }

    public async Task UpdateAsync(Discipline entity)
    {
        _context.Disciplines.Update(entity);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(Discipline entity)
    {
        _context.Disciplines.Remove(entity);
        await _context.SaveChangesAsync();
    }
}
