namespace LMS.Application.Interfaces.Services;

public interface IBackgroundJobDispatcher
{
    Task<T> RunAsync<T>(Func<CancellationToken, Task<T>> job, CancellationToken cancellationToken = default);
}
