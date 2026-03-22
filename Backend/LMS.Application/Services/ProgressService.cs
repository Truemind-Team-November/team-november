using LMS.Application.Common;
using LMS.Application.DTOs.Progress;
using LMS.Application.Interfaces.Repositories;
using LMS.Application.Interfaces.Services;
using LMS.Domain.Entities;

namespace LMS.Application.Services;

public class ProgressService : IProgressService
{
    private readonly IProgressRepository _progressRepository;
    private readonly ILessonProgressRepository _lessonProgressRepository;
    private readonly IEnrollmentRepository _enrollmentRepository;
    private readonly ILessonRepository _lessonRepository;

    public ProgressService(
        IProgressRepository progressRepository,
        ILessonProgressRepository lessonProgressRepository,
        IEnrollmentRepository enrollmentRepository,
        ILessonRepository lessonRepository)
    {
        _progressRepository = progressRepository;
        _lessonProgressRepository = lessonProgressRepository;
        _enrollmentRepository = enrollmentRepository;
        _lessonRepository = lessonRepository;
    }

    public async Task<BaseResponse<ProgressResponse>> GetProgressAsync(Guid userId, Guid courseId)
    {
        var progress = await _progressRepository.GetByUserAndCourseAsync(userId, courseId);
        
        if (progress == null)
            return BaseResponse<ProgressResponse>.Fail("Progress not found");

        var response = new ProgressResponse(
            progress.UserId,
            progress.CourseId,
            progress.TotalLessons,
            progress.CompletedLessons,
            progress.Percentage
        );

        return BaseResponse<ProgressResponse>.Ok(response);
    }

    public async Task<BaseResponse<bool>> CompleteLessonAsync(CompleteLessonRequest request)
    {
        try 
        {
            // 1. Update LessonProgress
            var lessonProgress = await _lessonProgressRepository.GetByUserAndLessonAsync(request.UserId, request.LessonId);
            
            if (lessonProgress == null)
            {
                lessonProgress = LessonProgress.Create(request.UserId, request.LessonId);
                await _lessonProgressRepository.AddAsync(lessonProgress);
            }

            if (lessonProgress.IsCompleted)
            {
                return BaseResponse<bool>.Ok(true, "Lesson already completed");
            }

            lessonProgress.MarkAsCompleted();
            await _lessonProgressRepository.UpdateAsync(lessonProgress);

            // Get Lesson to find CourseId
            var lesson = await _lessonRepository.GetByIdAsync(request.UserId); // Error here, Lesson should be by request.LessonId
            // Actually, I should use the lessonId from request
            var lessonItem = await _lessonRepository.GetByIdAsync(request.LessonId);
            if (lessonItem == null) return BaseResponse<bool>.Fail("Lesson not found");

            var courseId = lessonItem.CourseId;

            // 2. Count completed lessons
            var completedCount = await _lessonProgressRepository.GetCompletedLessonsCountAsync(request.UserId, courseId);

            // 3. Update Progress percentage
            var progress = await _progressRepository.GetByUserAndCourseAsync(request.UserId, courseId);
            if (progress != null)
            {
                progress.UpdateProgress(completedCount);
                await _progressRepository.UpdateAsync(progress);

                // 4. If 100%, mark Enrollment as completed
                if (progress.Percentage >= 100)
                {
                    var enrollment = await _enrollmentRepository.GetByUserAndCourseAsync(request.UserId, courseId);
                    if (enrollment != null && !enrollment.IsCompleted)
                    {
                        enrollment.MarkAsCompleted();
                        await _enrollmentRepository.UpdateAsync(enrollment);
                    }
                }
            }

            return BaseResponse<bool>.Ok(true, "Lesson completed successfully");
        }
        catch (Exception ex)
        {
            return BaseResponse<bool>.Fail(ex.Message);
        }
    }
}
