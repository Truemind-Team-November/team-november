using LMS.Domain.Entities;
using LMS.Domain.Enums;

public class LessonContent : BaseEntity
{
    public Guid LessonId { get; private set; }
    public Lesson Lesson { get; private set; } = default!; // 🔥 navigation

    public ContentType ContentType { get; private set; }

    public string? Url { get; private set; }
    public string? TextContent { get; private set; }

    public static LessonContent CreateVideo(Guid lessonId, string url)
    {
        if (lessonId == Guid.Empty)
            throw new ArgumentException("Lesson is required");

        if (string.IsNullOrWhiteSpace(url))
            throw new ArgumentException("Video URL is required");

        return new LessonContent
        {
            LessonId = lessonId,
            ContentType = ContentType.Video,
            Url = url.Trim()
        };
    }

    public static LessonContent CreatePdf(Guid lessonId, string url)
    {
        if (lessonId == Guid.Empty)
            throw new ArgumentException("Lesson is required");

        if (string.IsNullOrWhiteSpace(url))
            throw new ArgumentException("PDF URL is required");

        return new LessonContent
        {
            LessonId = lessonId,
            ContentType = ContentType.Pdf,
            Url = url.Trim()
        };
    }

    public static LessonContent CreateText(Guid lessonId, string text)
    {
        if (lessonId == Guid.Empty)
            throw new ArgumentException("Lesson is required");

        if (string.IsNullOrWhiteSpace(text))
            throw new ArgumentException("Text content is required");

        return new LessonContent
        {
            LessonId = lessonId,
            ContentType = ContentType.Text,
            TextContent = text
        };
    }

    public void UpdateText(string text)
    {
        if (ContentType != ContentType.Text)
            throw new InvalidOperationException("Not a text content");

        if (string.IsNullOrWhiteSpace(text))
            throw new ArgumentException("Text content is required");

        TextContent = text;
        SetUpdated();
    }

    public void UpdateUrl(string url)
    {
        if (ContentType == ContentType.Text)
            throw new InvalidOperationException("Text content does not use URL");

        if (string.IsNullOrWhiteSpace(url))
            throw new ArgumentException("URL is required");

        Url = url.Trim();
        SetUpdated();
    }
}