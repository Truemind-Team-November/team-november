namespace LMS.Domain.Entities;
public class LessonProgress : BaseEntity
{
    public Guid UserId { get; private set; }
    public Guid LessonId { get; private set; }

    public bool IsCompleted { get; private set; }
    public DateTime? CompletedAt { get; private set; }
    public int PlaybackPositionSeconds { get; private set; }
    public int? PlaybackDurationSeconds { get; private set; }
    public DateTime? LastAccessedAt { get; private set; }

    // Navigation
    public User User { get; private set; } = default!;
    public Lesson Lesson { get; private set; } = default!;

    private LessonProgress() { } // EF Core
    // Factory
    public static LessonProgress Create(Guid userId, Guid lessonId)
    {
        if (userId == Guid.Empty)
        {
            throw new ArgumentException("User is required");
        }  

        if (lessonId == Guid.Empty)
        {
            throw new ArgumentException("Lesson is required");
        } 

        return new LessonProgress
        {
            UserId = userId,
            LessonId = lessonId,
            IsCompleted = false
        };
    }

    public void RecordPlayback(int playbackPositionSeconds, int? playbackDurationSeconds)
    {
        if (playbackPositionSeconds < 0)
            throw new ArgumentException("Playback position cannot be negative");

        if (playbackDurationSeconds.HasValue && playbackDurationSeconds.Value <= 0)
            throw new ArgumentException("Playback duration must be greater than zero");

        if (playbackDurationSeconds.HasValue && playbackPositionSeconds > playbackDurationSeconds.Value)
            throw new ArgumentException("Playback position cannot be greater than playback duration");

        PlaybackPositionSeconds = playbackPositionSeconds;
        PlaybackDurationSeconds = playbackDurationSeconds;
        LastAccessedAt = DateTime.UtcNow;
        SetUpdated();
    }

    // Domain behavior
    public void MarkAsCompleted()
    {
        if (IsCompleted)
        {
            throw new InvalidOperationException("Lesson already completed");
        } 

        IsCompleted = true;
        CompletedAt = DateTime.UtcNow;
        LastAccessedAt = DateTime.UtcNow;

        SetUpdated();
    }
}
