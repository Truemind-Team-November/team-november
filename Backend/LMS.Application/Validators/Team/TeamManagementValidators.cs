using FluentValidation;
using LMS.Application.DTOs.Team;

namespace LMS.Application.Validators.Team;

public class CreateTeamRequestValidator : AbstractValidator<CreateTeamRequest>
{
    public CreateTeamRequestValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Team name is required")
            .MaximumLength(150);

        RuleFor(x => x.Description)
            .NotEmpty().WithMessage("Team description is required")
            .MaximumLength(500);
    }
}

public class UpdateTeamRequestValidator : AbstractValidator<UpdateTeamRequest>
{
    public UpdateTeamRequestValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Team name is required")
            .MaximumLength(150);

        RuleFor(x => x.Description)
            .NotEmpty().WithMessage("Team description is required")
            .MaximumLength(500);
    }
}

public class CreateDisciplineRequestValidator : AbstractValidator<CreateDisciplineRequest>
{
    public CreateDisciplineRequestValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Discipline name is required")
            .MaximumLength(100);
    }
}

public class UpdateDisciplineRequestValidator : AbstractValidator<UpdateDisciplineRequest>
{
    public UpdateDisciplineRequestValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Discipline name is required")
            .MaximumLength(100);
    }
}
