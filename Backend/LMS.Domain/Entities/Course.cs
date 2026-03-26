namespace LMS.Domain.Entities;
public class Course : BaseEntity
{
    public string Title { get; private set; } = default!;
    public string Description { get; private set; } = default!;

    public Guid InstructorId { get; private set; }
    public User Instructor { get; private set; } = default!; // 🔥 navigation

    private readonly List<Lesson> _lessons = new();
    public IReadOnlyCollection<Lesson> Lessons => _lessons.AsReadOnly();

    private readonly List<Enrollment> _enrollments = new();
    public IReadOnlyCollection<Enrollment> Enrollments => _enrollments.AsReadOnly();

    private readonly List<Assignment> _assignments = new();
    public IReadOnlyCollection<Assignment> Assignments => _assignments.AsReadOnly();

    public int LessonCount => _lessons.Count;

    private Course() { }

    // Factory
    public static Course Create(string title, string description, Guid instructorId)
    {
        if (string.IsNullOrWhiteSpace(title))
            throw new ArgumentException("Course title is required");

        if (string.IsNullOrWhiteSpace(description))
            throw new ArgumentException("Course description is required");

        if (instructorId == Guid.Empty)
            throw new ArgumentException("Instructor is required");

        return new Course
        {
            Title = title.Trim(),
            Description = description.Trim(),
            InstructorId = instructorId
        };
    }

    // Domain behavior
    public void UpdateDetails(string title, string description)
    {
        if (string.IsNullOrWhiteSpace(title))
            throw new ArgumentException("Course title is required");

        if (string.IsNullOrWhiteSpace(description))
            throw new ArgumentException("Course description is required");

        Title = title.Trim();
        Description = description.Trim();

        SetUpdated();
    }

    public void AddLesson(Lesson lesson)
    {
        if (lesson == null)
            throw new ArgumentNullException(nameof(lesson));

        if (lesson.CourseId != Id)
            throw new InvalidOperationException("Lesson does not belong to this course");

        _lessons.Add(lesson);
    }
}
