using LMS.Application.Interfaces.Services;

namespace LMS.Infrastructure.Services;

public class InlineBackgroundJobDispatcher : IBackgroundJobDispatcher
{
    public Task<T> RunAsync<T>(Func<CancellationToken, Task<T>> job, CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(job);
        return job(cancellationToken);
    }
}
