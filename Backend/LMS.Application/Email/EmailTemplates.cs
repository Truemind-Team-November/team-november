namespace LMS.Application.Email;

public static class EmailTemplates
{
    public static string PasswordReset(string resetLink)
    {
        return $@"
            <h2>Password Reset</h2>
            <p>Click the link below to reset your password:</p>
            <a href='{resetLink}'>Reset Password</a>
            <p>This link expires in 15 minutes.</p>
        ";
    }

    public static string Welcome(string fullName)
    {
        return $@"
            <h2>Welcome {fullName} 🎉</h2>
            <p>Your account has been created successfully.</p>
        ";
    }

    public static string AssignmentCreated(string title)
    {
        return $@"
            <h3>New Assignment Posted</h3>
            <p>{title}</p>
        ";
    }
}