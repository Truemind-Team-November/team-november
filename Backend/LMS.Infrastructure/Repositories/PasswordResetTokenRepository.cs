using LMS.Application.Interfaces.Repositories;
using LMS.Domain.Entities;
using LMS.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace LMS.Infrastructure.Repositories;

public class PasswordResetTokenRepository : IPasswordResetTokenRepository
{
    private readonly ApplicationDbContext _context;

    public PasswordResetTokenRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<PasswordResetToken?> GetByIdAsync(Guid id)
    {
        return await _context.PasswordResetTokens
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.Id == id);
    }

    public async Task<List<PasswordResetToken>> GetAllAsync()
    {
        return await _context.PasswordResetTokens
            .AsNoTracking()
            .ToListAsync();
    }

    public async Task<PasswordResetToken?> GetByTokenAsync(string token)
    {
        return await _context.PasswordResetTokens
            .Include(x => x.User) // needed for reset flow
            .FirstOrDefaultAsync(x => x.TokenHash == token);
    }

    public async Task AddAsync(PasswordResetToken entity)
    {
        await _context.PasswordResetTokens.AddAsync(entity);
    }

    public Task UpdateAsync(PasswordResetToken entity)
    {
        _context.PasswordResetTokens.Update(entity);
        return Task.CompletedTask;
    }

    public Task DeleteAsync(PasswordResetToken entity)
    {
        _context.PasswordResetTokens.Remove(entity);
        return Task.CompletedTask;
    }
}
