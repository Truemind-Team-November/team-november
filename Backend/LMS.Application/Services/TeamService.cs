using LMS.Application.Common;
using LMS.Application.DTOs.Team;
using LMS.Application.Interfaces.Repositories;
using LMS.Application.Interfaces.Services;
using LMS.Domain.Entities;

namespace LMS.Application.Services;

public class TeamService : ITeamService
{
    private readonly ITeamRepository _teamRepository;
    private readonly IDisciplineRepository _disciplineRepository;
    private readonly IUserRepository _userRepository;
    private readonly ICurrentUserService _currentUserService;
    private readonly IUnitOfWork _unitOfWork;
    private readonly INotificationService _notificationService;

    public TeamService(
        ITeamRepository teamRepository,
        IDisciplineRepository disciplineRepository,
        IUserRepository userRepository,
        ICurrentUserService currentUserService,
        IUnitOfWork unitOfWork,
        INotificationService notificationService)
    {
        _teamRepository = teamRepository;
        _disciplineRepository = disciplineRepository;
        _userRepository = userRepository;
        _currentUserService = currentUserService;
        _unitOfWork = unitOfWork;
        _notificationService = notificationService;
    }

    public async Task<BaseResponse<IEnumerable<TeamResponse>>> GetTeamsAsync()
    {
        var currentUserId = _currentUserService.UserId;
        var teams = await _teamRepository.GetAllWithMembersAsync();

        var response = teams
            .OrderBy(team => team.Name)
            .Select(team => MapToResponse(team, currentUserId))
            .ToList();

        return BaseResponse<IEnumerable<TeamResponse>>.Ok(response);
    }

    public async Task<BaseResponse<TeamResponse>> GetMyTeamAsync()
    {
        if (_currentUserService.UserId == null)
            return BaseResponse<TeamResponse>.Fail("Unauthorized");

        var team = await _teamRepository.GetByMemberIdAsync(_currentUserService.UserId.Value);

        if (team == null)
            return BaseResponse<TeamResponse>.Fail("User is not assigned to a team");

        return BaseResponse<TeamResponse>.Ok(MapToResponse(team, _currentUserService.UserId));
    }

    public async Task<BaseResponse<IEnumerable<TeamAllocationResponse>>> GetTeamAllocationAsync()
    {
        var teams = await _teamRepository.GetAllWithMembersAsync();

        var response = teams
            .OrderBy(team => team.Name)
            .Select(team => new TeamAllocationResponse(
                team.Id,
                team.Name,
                team.Members.Count,
                team.Members
                    .OrderBy(member => member.FirstName)
                    .ThenBy(member => member.LastName)
                    .Select(member => new TeamMemberResponse(
                        member.Id,
                        member.PublicId,
                        member.FullName,
                        member.Discipline,
                        _currentUserService.UserId.HasValue && member.Id == _currentUserService.UserId.Value))
                    .ToList()))
            .ToList();

        return BaseResponse<IEnumerable<TeamAllocationResponse>>.Ok(response);
    }

    public async Task<BaseResponse<IEnumerable<AllocatableLearnerResponse>>> GetUnassignedLearnersAsync()
    {
        var users = await _userRepository.GetAllAsync();

        var response = users
            .Where(user => user.IsLearner() && user.TeamId == null)
            .OrderBy(user => user.FirstName)
            .ThenBy(user => user.LastName)
            .Select(MapToAllocatableLearnerResponse)
            .ToList();

        return BaseResponse<IEnumerable<AllocatableLearnerResponse>>.Ok(response);
    }

    public async Task<BaseResponse<IEnumerable<DisciplineResponse>>> GetDisciplinesAsync()
    {
        var disciplines = await _disciplineRepository.GetAllAsync();

        var response = disciplines
            .OrderBy(discipline => discipline.Name)
            .Select(MapToDisciplineResponse)
            .ToList();

        return BaseResponse<IEnumerable<DisciplineResponse>>.Ok(response);
    }

    public async Task<BaseResponse<TeamResponse>> CreateTeamAsync(CreateTeamRequest request)
    {
        if (await _teamRepository.GetByNameAsync(request.Name) != null)
            return BaseResponse<TeamResponse>.Fail("A team with this name already exists");

        var team = Team.Create(request.Name, request.Description);

        try
        {
            await _teamRepository.AddAsync(team);
        }
        catch (Exception ex) when (IsUniqueConstraintViolation(ex))
        {
            return BaseResponse<TeamResponse>.Fail("A team with this name already exists");
        }

        var createdTeam = await _teamRepository.GetByIdAsync(team.Id) ?? team;
        return BaseResponse<TeamResponse>.Ok(
            MapToResponse(createdTeam, _currentUserService.UserId),
            "Team created successfully");
    }

    public async Task<BaseResponse<TeamResponse>> UpdateTeamAsync(Guid teamId, UpdateTeamRequest request)
    {
        var team = await _teamRepository.GetByIdAsync(teamId);
        if (team == null)
            return BaseResponse<TeamResponse>.Fail("Team not found");

        var existingTeam = await _teamRepository.GetByNameAsync(request.Name);
        if (existingTeam != null && existingTeam.Id != teamId)
            return BaseResponse<TeamResponse>.Fail("A team with this name already exists");

        team.UpdateDetails(request.Name, request.Description);
        await _teamRepository.UpdateAsync(team);

        var updatedTeam = await _teamRepository.GetByIdAsync(teamId) ?? team;
        return BaseResponse<TeamResponse>.Ok(
            MapToResponse(updatedTeam, _currentUserService.UserId),
            "Team updated successfully");
    }

    public async Task<BaseResponse<string>> DeleteTeamAsync(Guid teamId)
    {
        var team = await _teamRepository.GetByIdAsync(teamId);
        if (team == null)
            return BaseResponse<string>.Fail("Team not found");

        if (team.Members.Any())
            return BaseResponse<string>.Fail("Cannot delete a team that still has members");

        await _teamRepository.DeleteAsync(team);
        return BaseResponse<string>.Ok("Team deleted successfully");
    }

    public async Task<BaseResponse<TeamMemberResponse>> AssignUserToTeamAsync(Guid teamId, Guid userId)
    {
        var team = await _teamRepository.GetByIdAsync(teamId);
        if (team == null)
            return BaseResponse<TeamMemberResponse>.Fail("Team not found");

        var user = await _userRepository.GetByIdAsync(userId);
        if (user == null)
            return BaseResponse<TeamMemberResponse>.Fail("User not found");

        if (!user.IsLearner())
            return BaseResponse<TeamMemberResponse>.Fail("Only learners can be assigned to teams");

        user.AssignToTeam(teamId);
        await _userRepository.UpdateAsync(user);
        await _notificationService.NotifyUserAsync(new LMS.Application.DTOs.Notification.CreateNotificationRequest(
            user.Id,
            LMS.Domain.Enums.NotificationType.TeamUpdate,
            "Team Update",
            $"You have been added to the {team.Name} cross-functional team.",
            "/my-team"
        ));

        return BaseResponse<TeamMemberResponse>.Ok(
            MapToTeamMemberResponse(user, _currentUserService.UserId),
            "Learner assigned to team successfully");
    }

    public async Task<BaseResponse<string>> RemoveUserFromTeamAsync(Guid userId)
    {
        var user = await _userRepository.GetByIdAsync(userId);
        if (user == null)
            return BaseResponse<string>.Fail("User not found");

        if (!user.IsLearner())
            return BaseResponse<string>.Fail("Only learners can be assigned to teams");

        if (user.TeamId == null)
            return BaseResponse<string>.Fail("Learner is not assigned to a team");

        user.RemoveFromTeam();
        await _userRepository.UpdateAsync(user);
        await _notificationService.NotifyUserAsync(new LMS.Application.DTOs.Notification.CreateNotificationRequest(
            user.Id,
            LMS.Domain.Enums.NotificationType.TeamUpdate,
            "Team Update",
            "Your team assignment has been cleared. An admin will assign you to another team soon.",
            "/my-team"
        ));

        return BaseResponse<string>.Ok("Learner removed from team successfully");
    }

    public async Task<BaseResponse<DisciplineResponse>> CreateDisciplineAsync(CreateDisciplineRequest request)
    {
        if (await _disciplineRepository.GetByNameIncludingDeletedAsync(request.Name) != null)
            return BaseResponse<DisciplineResponse>.Fail("A discipline with this name already exists");

        var discipline = Discipline.Create(request.Name);

        try
        {
            await _disciplineRepository.AddAsync(discipline);
        }
        catch (Exception ex) when (IsUniqueConstraintViolation(ex))
        {
            return BaseResponse<DisciplineResponse>.Fail("A discipline with this name already exists");
        }

        var createdDiscipline = await _disciplineRepository.GetByIdAsync(discipline.Id) ?? discipline;
        return BaseResponse<DisciplineResponse>.Ok(
            MapToDisciplineResponse(createdDiscipline),
            "Discipline created successfully");
    }

    public async Task<BaseResponse<DisciplineResponse>> UpdateDisciplineAsync(Guid disciplineId, UpdateDisciplineRequest request)
    {
        var discipline = await _disciplineRepository.GetByIdAsync(disciplineId);
        if (discipline == null)
            return BaseResponse<DisciplineResponse>.Fail("Discipline not found");

        if (await _disciplineRepository.ExistsByNameAsync(request.Name, disciplineId))
            return BaseResponse<DisciplineResponse>.Fail("A discipline with this name already exists");

        var previousName = discipline.Name;
        await _unitOfWork.BeginTransactionAsync();

        try
        {
            discipline.Update(request.Name);
            await _disciplineRepository.UpdateAsync(discipline);

            var users = await _userRepository.GetAllAsync();
            var affectedUsers = users
                .Where(user => string.Equals(user.Discipline, previousName, StringComparison.OrdinalIgnoreCase))
                .ToList();

            foreach (var user in affectedUsers)
            {
                user.ChangeDiscipline(discipline.Name);
                await _userRepository.UpdateAsync(user);
            }

            await _unitOfWork.CommitAsync();
        }
        catch
        {
            await _unitOfWork.RollbackAsync();
            throw;
        }

        var updatedDiscipline = await _disciplineRepository.GetByIdAsync(disciplineId) ?? discipline;
        return BaseResponse<DisciplineResponse>.Ok(
            MapToDisciplineResponse(updatedDiscipline),
            "Discipline updated successfully");
    }

    public async Task<BaseResponse<string>> DeleteDisciplineAsync(Guid disciplineId)
    {
        var discipline = await _disciplineRepository.GetByIdAsync(disciplineId);
        if (discipline == null)
            return BaseResponse<string>.Fail("Discipline not found");

        var users = await _userRepository.GetAllAsync();
        if (users.Any(user => string.Equals(user.Discipline, discipline.Name, StringComparison.OrdinalIgnoreCase)))
            return BaseResponse<string>.Fail("Cannot delete a discipline that is assigned to users");

        await _disciplineRepository.DeleteAsync(discipline);
        return BaseResponse<string>.Ok("Discipline deleted successfully");
    }

    private static TeamResponse MapToResponse(Team team, Guid? currentUserId)
    {
        var members = team.Members
            .OrderBy(member => member.FirstName)
            .ThenBy(member => member.LastName)
            .Select(member => MapToTeamMemberResponse(member, currentUserId))
            .ToList();

        return new TeamResponse(
            team.Id,
            team.Name,
            team.Description,
            members.Count,
            Array.Empty<DisciplineResponse>(),
            members);
    }

    private static DisciplineResponse MapToDisciplineResponse(Discipline discipline)
    {
        return new DisciplineResponse(
            discipline.Id,
            discipline.Name);
    }

    private static TeamMemberResponse MapToTeamMemberResponse(User user, Guid? currentUserId)
    {
        return new TeamMemberResponse(
            user.Id,
            user.PublicId,
            user.FullName,
            user.Discipline,
            currentUserId.HasValue && user.Id == currentUserId.Value);
    }

    private static AllocatableLearnerResponse MapToAllocatableLearnerResponse(User user)
    {
        return new AllocatableLearnerResponse(
            user.Id,
            user.PublicId,
            user.FullName,
            user.Discipline,
            user.TeamId,
            user.Team?.Name);
    }

    private static bool IsUniqueConstraintViolation(Exception exception)
    {
        const string uniqueViolationCode = "23505";

        if (exception.GetType().FullName == "Microsoft.EntityFrameworkCore.DbUpdateException"
            && exception.InnerException?.GetType().FullName == "Npgsql.PostgresException")
        {
            var sqlState = exception.InnerException.GetType().GetProperty("SqlState")?.GetValue(exception.InnerException) as string;
            return string.Equals(sqlState, uniqueViolationCode, StringComparison.Ordinal);
        }

        return false;
    }
}
