using LMS.Domain.Enums;
namespace LMS.Domain.Entities;

public class User : BaseEntity
{
    public string FirstName { get; private set; } = default!;
    public string LastName { get; private set; } = default!;
    public string Email { get; private set; } = default!;
    public string PasswordHash { get; private set; } = default!;

    public UserRole Role { get; private set; } = UserRole.Learner;

    public bool IsAdmin() => Role == UserRole.Admin;
    public bool IsInstructor() => Role == UserRole.Instructor;
    public bool IsLearner() => Role == UserRole.Learner;

    private readonly List<Enrollment> _enrollments = new();
    public IReadOnlyCollection<Enrollment> Enrollments => _enrollments.AsReadOnly();

    public string FullName => $"{FirstName} {LastName}";

    private User() { }

    public static User Create(string firstName, string lastName, string email, string passwordHash, UserRole role)
    {
        if (string.IsNullOrWhiteSpace(firstName))
            throw new ArgumentException("First name is required");

        if (string.IsNullOrWhiteSpace(lastName))
            throw new ArgumentException("Last name is required");

        if (string.IsNullOrWhiteSpace(email))
            throw new ArgumentException("Email is required");

        if (!email.Contains("@") || !email.Contains("."))
            throw new ArgumentException("Invalid email format");

        if (string.IsNullOrWhiteSpace(passwordHash))
            throw new ArgumentException("Password hash is required");

        if (!Enum.IsDefined(typeof(UserRole), role))
            throw new ArgumentException("Invalid role");

        return new User
        {
            FirstName = firstName.Trim(),
            LastName = lastName.Trim(),
            Email = email.Trim().ToLowerInvariant(),
            PasswordHash = passwordHash,
            Role = role
        };
    }

    public void ChangeRole(UserRole role)
    {
        if (!Enum.IsDefined(typeof(UserRole), role))
            throw new ArgumentException("Invalid role");

        Role = role;
        SetUpdated();
    }

    public void SetPassword(string hashedPassword)
    {
        if (string.IsNullOrWhiteSpace(hashedPassword))
            throw new ArgumentException("Password hash is required");

        PasswordHash = hashedPassword;
        SetUpdated();
    }


}