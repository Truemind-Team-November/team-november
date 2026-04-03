using LMS.Application.Common;
using LMS.Application.DTOs.Team;

namespace LMS.Application.Interfaces.Services;

public interface ITeamService
{
    Task<BaseResponse<IEnumerable<TeamResponse>>> GetTeamsAsync();
    Task<BaseResponse<TeamResponse>> GetMyTeamAsync();
    Task<BaseResponse<IEnumerable<TeamAllocationResponse>>> GetTeamAllocationAsync();
    Task<BaseResponse<IEnumerable<DisciplineResponse>>> GetDisciplinesAsync();
    Task<BaseResponse<TeamResponse>> CreateTeamAsync(CreateTeamRequest request);
    Task<BaseResponse<TeamResponse>> UpdateTeamAsync(Guid teamId, UpdateTeamRequest request);
    Task<BaseResponse<string>> DeleteTeamAsync(Guid teamId);
    Task<BaseResponse<DisciplineResponse>> CreateDisciplineAsync(CreateDisciplineRequest request);
    Task<BaseResponse<DisciplineResponse>> UpdateDisciplineAsync(Guid disciplineId, UpdateDisciplineRequest request);
    Task<BaseResponse<string>> DeleteDisciplineAsync(Guid disciplineId);
}
