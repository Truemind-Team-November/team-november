namespace LMS.Domain.Entities;

public class CourseReview : BaseEntity
{
    public Guid CourseId { get; private set; }
    public Course Course { get; private set; } = default!;

    public Guid UserId { get; private set; }
    public User User { get; private set; } = default!;

    public int Rating { get; private set; }
    public string? Comment { get; private set; }

    private CourseReview() { }

    public static CourseReview Create(Guid courseId, Guid userId, int rating, string? comment)
    {
        if (courseId == Guid.Empty)
            throw new ArgumentException("Course is required");

        if (userId == Guid.Empty)
            throw new ArgumentException("User is required");

        ValidateRating(rating);

        return new CourseReview
        {
            CourseId = courseId,
            UserId = userId,
            Rating = rating,
            Comment = NormalizeComment(comment)
        };
    }

    public void Update(int rating, string? comment)
    {
        ValidateRating(rating);
        Rating = rating;
        Comment = NormalizeComment(comment);
        SetUpdated();
    }

    private static void ValidateRating(int rating)
    {
        if (rating < 1 || rating > 5)
            throw new ArgumentException("Rating must be between 1 and 5");
    }

    private static string? NormalizeComment(string? comment)
    {
        return string.IsNullOrWhiteSpace(comment) ? null : comment.Trim();
    }
}
