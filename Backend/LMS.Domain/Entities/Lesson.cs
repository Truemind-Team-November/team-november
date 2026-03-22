using LMS.Domain.Entities;

public class Lesson : BaseEntity
{
    public Guid CourseId { get; private set; }
    public Course Course { get; private set; } = default!; // 🔥 navigation

    public string Title { get; private set; } = default!;
    public int Order { get; private set; }

    private readonly List<LessonContent> _contents = new();
    public IReadOnlyCollection<LessonContent> Contents => _contents.AsReadOnly();

    public int ContentCount => _contents.Count;

    public static Lesson Create(Guid courseId, string title, int order)
    {
        if (courseId == Guid.Empty)
            throw new ArgumentException("Course is required");

        if (string.IsNullOrWhiteSpace(title))
            throw new ArgumentException("Lesson title is required");

        if (order <= 0)
            throw new ArgumentException("Order must be greater than zero");

        return new Lesson
        {
            CourseId = courseId,
            Title = title.Trim(),
            Order = order
        };
    }

    public void UpdateDetails(string title)
    {
        if (string.IsNullOrWhiteSpace(title))
            throw new ArgumentException("Lesson title is required");

        Title = title.Trim();
        SetUpdated();
    }

    public void AddContent(LessonContent content)
    {
        if (content == null)
        {
            throw new ArgumentNullException(nameof(content));
        }


        if (content.LessonId != Id)
        {
            throw new InvalidOperationException("Content does not belong to this lesson");
        }
        _contents.Add(content);
    }
}