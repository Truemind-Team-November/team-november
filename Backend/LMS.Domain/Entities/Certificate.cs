namespace LMS.Domain.Entities;

public class Certificate : BaseEntity
{
    public Guid UserId { get; private set; }
    public User User { get; private set; } = default!;

    public Guid CourseId { get; private set; }
    public Course Course { get; private set; } = default!;

    public string CertificateNumber { get; private set; } = default!;
    public string VerificationCode { get; private set; } = default!;
    public string RecipientFullName { get; private set; } = default!;
    public string RecipientPublicId { get; private set; } = default!;
    public string RecipientDiscipline { get; private set; } = default!;
    public string? RecipientCohortLabel { get; private set; }
    public string CourseTitleSnapshot { get; private set; } = default!;
    public string IssuedBy { get; private set; } = default!;
    public string TemplateVersion { get; private set; } = default!;
    public string? DocumentUrl { get; private set; }

    public decimal FinalScore { get; private set; }

    public DateTime IssuedAt { get; private set; }
    public DateTime? CompletedAt { get; private set; }

    private Certificate() { } // EF Core

    public static Certificate Create(
        Guid userId,
        Guid courseId,
        decimal finalScore,
        string recipientFullName,
        string recipientPublicId,
        string recipientDiscipline,
        string? recipientCohortLabel,
        string courseTitle,
        DateTime? completedAt,
        string issuedBy,
        string templateVersion)
    {
        if (userId == Guid.Empty)
            throw new ArgumentException("User is required");

        if (courseId == Guid.Empty)
            throw new ArgumentException("Course is required");

        if (finalScore < 0 || finalScore > 100)
            throw new ArgumentException("Invalid score");

        if (string.IsNullOrWhiteSpace(recipientFullName))
            throw new ArgumentException("Recipient full name is required");

        if (string.IsNullOrWhiteSpace(recipientPublicId))
            throw new ArgumentException("Recipient public id is required");

        if (string.IsNullOrWhiteSpace(recipientDiscipline))
            throw new ArgumentException("Recipient discipline is required");

        if (string.IsNullOrWhiteSpace(courseTitle))
            throw new ArgumentException("Course title is required");

        if (string.IsNullOrWhiteSpace(issuedBy))
            throw new ArgumentException("Issuer is required");

        if (string.IsNullOrWhiteSpace(templateVersion))
            throw new ArgumentException("Template version is required");

        return new Certificate
        {
            UserId = userId,
            CourseId = courseId,
            FinalScore = finalScore,
            CertificateNumber = GenerateCertificateNumber(),
            VerificationCode = GenerateVerificationCode(),
            RecipientFullName = recipientFullName.Trim(),
            RecipientPublicId = recipientPublicId.Trim(),
            RecipientDiscipline = recipientDiscipline.Trim(),
            RecipientCohortLabel = string.IsNullOrWhiteSpace(recipientCohortLabel) ? null : recipientCohortLabel.Trim(),
            CourseTitleSnapshot = courseTitle.Trim(),
            IssuedBy = issuedBy.Trim(),
            TemplateVersion = templateVersion.Trim(),
            IssuedAt = DateTime.UtcNow,
            CompletedAt = completedAt
        };
    }

    public void AttachDocument(string documentUrl)
    {
        if (string.IsNullOrWhiteSpace(documentUrl))
            throw new ArgumentException("Document URL is required");

        DocumentUrl = documentUrl.Trim();
        SetUpdated();
    }

    public bool EnsureVerificationCode()
    {
        if (!string.IsNullOrWhiteSpace(VerificationCode))
            return false;

        VerificationCode = GenerateVerificationCode();
        SetUpdated();
        return true;
    }

    private static string GenerateCertificateNumber()
    {
        return $"CERT-{DateTime.UtcNow:yyyy}-{Guid.NewGuid().ToString()[..8].ToUpper()}";
    }

    private static string GenerateVerificationCode()
    {
        return Guid.NewGuid().ToString("D");
    }
}
