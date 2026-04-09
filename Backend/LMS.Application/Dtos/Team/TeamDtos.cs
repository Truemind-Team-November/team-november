namespace LMS.Application.DTOs.Team;

public record DisciplineResponse(
    Guid Id,
    string Name
);

public record CreateTeamRequest(string Name, string Description);
public record UpdateTeamRequest(string Name, string Description);

public record CreateDisciplineRequest(string Name);
public record UpdateDisciplineRequest(string Name);

public record TeamMemberResponse(
    Guid Id,
    string PublicId,
    string FullName,
    string Discipline,
    bool IsCurrentUser
);

public record TeamResponse(
    Guid Id,
    string Name,
    string Description,
    int MemberCount,
    IReadOnlyCollection<DisciplineResponse> Disciplines,
    IReadOnlyCollection<TeamMemberResponse> Members
);

public record TeamAllocationResponse(
    Guid Id,
    string Name,
    int MemberCount,
    IReadOnlyCollection<TeamMemberResponse> Members
);

public record AllocatableLearnerResponse(
    Guid Id,
    string PublicId,
    string FullName,
    string Discipline,
    Guid? TeamId,
    string? TeamName
);
