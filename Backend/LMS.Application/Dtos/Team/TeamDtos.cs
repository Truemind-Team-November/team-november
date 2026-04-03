namespace LMS.Application.DTOs.Team;

public record DisciplineResponse(
    Guid Id,
    string Name,
    Guid TeamId,
    string TeamName
);

public record CreateTeamRequest(string Name, string Description);
public record UpdateTeamRequest(string Name, string Description);

public record CreateDisciplineRequest(string Name, Guid TeamId);
public record UpdateDisciplineRequest(string Name, Guid TeamId);

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
