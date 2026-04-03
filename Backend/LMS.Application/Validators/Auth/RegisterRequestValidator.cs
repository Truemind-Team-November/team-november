using FluentValidation;
using LMS.Application.DTOs.Auth;
using LMS.Application.Interfaces.Repositories;

namespace LMS.Application.Validators.Auth;

public class RegisterRequestValidator : AbstractValidator<RegisterRequest>
{
    public RegisterRequestValidator(IDisciplineRepository disciplineRepository)
    {
        RuleFor(x => x)
            .MustAsync(async (_, cancellationToken) => await disciplineRepository.HasAnyAsync())
            .WithMessage("Registration is unavailable until an admin creates at least one discipline");

        RuleFor(x => x.FirstName)
            .NotEmpty().WithMessage("First name is required")
            .MaximumLength(100)
            .Matches("^[a-zA-Z]+$").WithMessage("First name must contain only letters");

        RuleFor(x => x.LastName)
            .NotEmpty().WithMessage("Last name is required")
            .MaximumLength(100)
            .Matches("^[a-zA-Z]+$").WithMessage("Last name must contain only letters");

        RuleFor(x => x.Email)
            .NotEmpty().WithMessage("Email is required")
            .EmailAddress().WithMessage("Invalid email format");

        RuleFor(x => x.Discipline)
            .NotEmpty().WithMessage("Discipline is required")
            .MaximumLength(100)
            .MustAsync(async (discipline, cancellationToken) =>
                !await disciplineRepository.HasAnyAsync() ||
                await disciplineRepository.GetByNameAsync(discipline) != null)
            .WithMessage("Please select a valid discipline");

        RuleFor(x => x.Password)
            .NotEmpty().WithMessage("Password is required")
            .MinimumLength(8).WithMessage("Password must be at least 8 characters long")
            .Matches("[A-Z]").WithMessage("Password must contain at least one uppercase letter")
            .Matches("[a-z]").WithMessage("Password must contain at least one lowercase letter")
            .Matches("[0-9]").WithMessage("Password must contain at least one number")
            .Matches("[^a-zA-Z0-9]").WithMessage("Password must contain a special character");

        RuleFor(x => x.ConfirmPassword)
            .Equal(x => x.Password).WithMessage("Passwords do not match");
    }
}
