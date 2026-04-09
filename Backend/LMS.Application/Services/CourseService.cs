using LMS.Application.Common;
using LMS.Application.Common.Options;
using LMS.Application.Common.Storage;
using LMS.Application.DTOs.Course;
using LMS.Application.Interfaces.Repositories;
using LMS.Application.Interfaces.Services;
using LMS.Domain.Entities;
using Microsoft.Extensions.Options;

namespace LMS.Application.Services;

public class CourseService : ICourseService
{
    private readonly ICourseRepository _courseRepository;
    private readonly ICourseBrowseRepository _courseBrowseRepository;
    private readonly ICourseReviewRepository _courseReviewRepository;
    private readonly IEnrollmentRepository _enrollmentRepository;
    private readonly ICurrentUserService _currentUserService;
    private readonly IFileStorageService _fileStorageService;
    private readonly FileStorageOptions _fileStorageOptions;

    public CourseService(
        ICourseRepository courseRepository,
        ICourseBrowseRepository courseBrowseRepository,
        ICourseReviewRepository courseReviewRepository,
        IEnrollmentRepository enrollmentRepository,
        ICurrentUserService currentUserService,
        IFileStorageService fileStorageService,
        IOptions<FileStorageOptions> fileStorageOptions)
    {
        _courseRepository = courseRepository;
        _courseBrowseRepository = courseBrowseRepository;
        _courseReviewRepository = courseReviewRepository;
        _enrollmentRepository = enrollmentRepository;
        _currentUserService = currentUserService;
        _fileStorageService = fileStorageService;
        _fileStorageOptions = fileStorageOptions.Value;
    }

    public async Task<BaseResponse<CourseResponse>> CreateCourseAsync(CreateCourseRequest request)
    {
        var course = Course.Create(
            request.Title,
            request.Description,
            request.Category,
            request.EstimatedHours,
            request.ThumbnailUrl,
            request.InstructorId
        );
        await _courseRepository.AddAsync(course);

        // Reload the course with related instructor so the response includes the
        // instructor's full name instead of "Unknown".
        var createdCourse = await _courseRepository.GetByIdAsync(course.Id) ?? course;
        var response = MapToResponse(createdCourse);
        return BaseResponse<CourseResponse>.Ok(response, "Course created successfully");
    }

    public async Task<BaseResponse<CourseResponse>> UpdateCourseAsync(Guid id, UpdateCourseRequest request)
    {
        var course = await _courseRepository.GetByIdAsync(id);
        if (course == null) return BaseResponse<CourseResponse>.Fail("Course not found");

        course.UpdateDetails(
            request.Title,
            request.Description,
            request.Category,
            request.EstimatedHours,
            request.ThumbnailUrl
        );
        await _courseRepository.UpdateAsync(course);

        return BaseResponse<CourseResponse>.Ok(MapToResponse(course), "Course updated successfully");
    }

    public async Task<BaseResponse<CourseResponse>> GetCourseByIdAsync(Guid id)
    {
        var course = await _courseRepository.GetByIdAsync(id);
        if (course == null) return BaseResponse<CourseResponse>.Fail("Course not found");

        return BaseResponse<CourseResponse>.Ok(MapToResponse(course));
    }

    public async Task<BaseResponse<IEnumerable<CourseResponse>>> GetAllCoursesAsync()
    {
        var courses = await _courseRepository.GetAllAsync();
        var response = courses.Select(MapToResponse);
        return BaseResponse<IEnumerable<CourseResponse>>.Ok(response);
    }

    public async Task<BaseResponse<IEnumerable<CourseCatalogItemResponse>>> GetCatalogAsync(string? search, string? category, bool enrolledOnly)
    {
        var catalog = await _courseBrowseRepository.GetCatalogAsync(_currentUserService.UserId, search, category, enrolledOnly);
        return BaseResponse<IEnumerable<CourseCatalogItemResponse>>.Ok(catalog);
    }

    public async Task<BaseResponse<CourseDetailResponse>> GetCourseDetailAsync(Guid courseId)
    {
        var course = await _courseBrowseRepository.GetCourseDetailAsync(_currentUserService.UserId, courseId);
        if (course == null)
            return BaseResponse<CourseDetailResponse>.Fail("Course not found");

        return BaseResponse<CourseDetailResponse>.Ok(course);
    }

    public async Task<BaseResponse<IReadOnlyCollection<CourseReviewResponse>>> GetCourseReviewsAsync(Guid courseId)
    {
        var course = await _courseRepository.GetByIdAsync(courseId);
        if (course == null)
            return BaseResponse<IReadOnlyCollection<CourseReviewResponse>>.Fail("Course not found");

        var reviews = await _courseBrowseRepository.GetCourseReviewsAsync(courseId);
        return BaseResponse<IReadOnlyCollection<CourseReviewResponse>>.Ok(reviews);
    }

    public async Task<BaseResponse<CourseReviewResponse>> CreateOrUpdateReviewAsync(Guid courseId, CreateCourseReviewRequest request)
    {
        if (!_currentUserService.UserId.HasValue)
            return BaseResponse<CourseReviewResponse>.Fail("Unauthorized");

        var course = await _courseRepository.GetByIdAsync(courseId);
        if (course == null)
            return BaseResponse<CourseReviewResponse>.Fail("Course not found");

        var enrollment = await _enrollmentRepository.GetByUserAndCourseAsync(_currentUserService.UserId.Value, courseId);
        if (enrollment == null)
            return BaseResponse<CourseReviewResponse>.Fail("You must enroll in this course before leaving a review");

        if (!enrollment.IsCompleted)
            return BaseResponse<CourseReviewResponse>.Fail("You can review this course after completing it");

        var existingReview = await _courseReviewRepository.GetByUserAndCourseAsync(_currentUserService.UserId.Value, courseId);

        try
        {
            if (existingReview == null)
            {
                existingReview = CourseReview.Create(courseId, _currentUserService.UserId.Value, request.Rating, request.Comment);
                await _courseReviewRepository.AddAsync(existingReview);
            }
            else
            {
                existingReview.Update(request.Rating, request.Comment);
                await _courseReviewRepository.UpdateAsync(existingReview);
            }
        }
        catch (ArgumentException ex)
        {
            return BaseResponse<CourseReviewResponse>.Fail(ex.Message);
        }

        var persistedReview = await _courseReviewRepository.GetByUserAndCourseAsync(_currentUserService.UserId.Value, courseId) ?? existingReview;

        return BaseResponse<CourseReviewResponse>.Ok(
            new CourseReviewResponse(
                persistedReview.Id,
                persistedReview.CourseId,
                persistedReview.UserId,
                persistedReview.User?.FullName ?? "Unknown",
                persistedReview.User?.PublicId ?? "Unknown",
                persistedReview.Rating,
                persistedReview.Comment,
                persistedReview.UpdatedAt ?? persistedReview.CreatedAt),
            "Course review saved successfully");
    }

    public async Task<BaseResponse<CourseResponse>> UploadThumbnailAsync(
        Guid courseId,
        FileUploadRequest request,
        CancellationToken cancellationToken = default)
    {
        var course = await _courseRepository.GetByIdAsync(courseId);
        if (course == null)
            return BaseResponse<CourseResponse>.Fail("Course not found");

        if (!request.ContentType.StartsWith("image/", StringComparison.OrdinalIgnoreCase))
            return BaseResponse<CourseResponse>.Fail("Only image files are allowed");

        FileUploadResult uploadResult;
        try
        {
            var uploadRequest = request with { Folder = _fileStorageOptions.CourseThumbnailFolder };
            uploadResult = await _fileStorageService.UploadImageAsync(uploadRequest, cancellationToken);
        }
        catch (InvalidOperationException ex)
        {
            return BaseResponse<CourseResponse>.Fail(ex.Message);
        }

        course.UpdateThumbnail(uploadResult.Url);
        await _courseRepository.UpdateAsync(course);

        return BaseResponse<CourseResponse>.Ok(MapToResponse(course), "Course thumbnail uploaded successfully");
    }

    private CourseResponse MapToResponse(Course course)
    {
        return new CourseResponse(
            course.Id,
            course.Title,
            course.Description,
            course.Category,
            course.EstimatedHours,
            course.ThumbnailUrl,
            course.InstructorId,
            course.Instructor?.FullName ?? "Unknown",
            course.LessonCount
        );
    }
}
