using LMS.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Configuration;

namespace LMS.Infrastructure.Services;

public class TokenCleanupService : BackgroundService
{
    private readonly IServiceScopeFactory _scopeFactory;
    private readonly ILogger<TokenCleanupService> _logger;
    private readonly IConfiguration _configuration;

    public TokenCleanupService(IServiceScopeFactory scopeFactory, IConfiguration configuration, ILogger<TokenCleanupService> logger)
    {
        _scopeFactory = scopeFactory;
        _configuration = configuration;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        var defaultConn = _configuration.GetConnectionString("DefaultConnection");
        if (string.IsNullOrWhiteSpace(defaultConn))
        {
            _logger.LogWarning("DefaultConnection is not configured. TokenCleanupService will not run.");
            return;
        }

        _logger.LogInformation("TokenCleanupService started");

        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                using var scope = _scopeFactory.CreateScope();
                var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

                // Ensure DB can be reached before attempting work
                if (!await context.Database.CanConnectAsync(stoppingToken))
                {
                    _logger.LogWarning("Database is not available. TokenCleanupService will retry shortly.");
                    await Task.Delay(TimeSpan.FromMinutes(1), stoppingToken);
                    continue;
                }

                var expiredTokens = await context.PasswordResetTokens
                    .Where(x => x.ExpiresAt < DateTime.UtcNow || x.IsUsed)
                    .ToListAsync(stoppingToken);

                if (expiredTokens.Any())
                {
                    context.PasswordResetTokens.RemoveRange(expiredTokens);
                    await context.SaveChangesAsync(stoppingToken);
                    _logger.LogInformation("Removed {Count} expired password reset tokens", expiredTokens.Count);
                }

                // Run every 1 hour
                await Task.Delay(TimeSpan.FromHours(1), stoppingToken);
            }
            catch (OperationCanceledException) when (stoppingToken.IsCancellationRequested)
            {
                // shutting down
                break;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while cleaning up tokens. Retrying in 1 minute.");
                try
                {
                    await Task.Delay(TimeSpan.FromMinutes(1), stoppingToken);
                }
                catch (OperationCanceledException) when (stoppingToken.IsCancellationRequested)
                {
                    break;
                }
            }
        }

        _logger.LogInformation("TokenCleanupService stopped");
    }
}
