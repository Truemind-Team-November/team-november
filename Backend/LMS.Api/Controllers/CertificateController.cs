using LMS.Application.Common;
using LMS.Application.DTOs.Certificate;
using LMS.Application.Interfaces.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LMS.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
public class CertificateController : ControllerBase
{
    private readonly ICertificateService _certificateService;

    public CertificateController(ICertificateService certificateService)
    {
        _certificateService = certificateService;
    }

    /// <summary>
    /// Get my certificates (Learner only)
    /// </summary>
    [HttpGet("me")]
    [Authorize(Roles = "Learner")]
    [ProducesResponseType(typeof(BaseResponse<IEnumerable<CertificateResponse>>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(BaseResponse<string>), StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> GetMyCertificates()
    {
        var result = await _certificateService.GetMyCertificatesAsync();
        return Ok(result);
    }

    /// <summary>
    /// Issue certificate for a completed course (Learner only)
    /// </summary>
    [HttpPost("{courseId:guid}")]
    [Authorize(Roles = "Learner")]
    [ProducesResponseType(typeof(BaseResponse<CertificateResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(BaseResponse<string>), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(BaseResponse<string>), StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> Issue(Guid courseId)
    {
        var result = await _certificateService.IssueCertificateAsync(courseId);

        return result.Success ? Ok(result) : BadRequest(result);
    }

    /// <summary>
    /// Regenerate my certificate document (Learner only)
    /// </summary>
    [HttpPost("me/{certificateId:guid}/regenerate")]
    [Authorize(Roles = "Learner")]
    [ProducesResponseType(typeof(BaseResponse<CertificateResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(BaseResponse<string>), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(BaseResponse<string>), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(BaseResponse<string>), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> RegenerateMyCertificate(Guid certificateId)
    {
        var result = await _certificateService.RegenerateMyCertificateAsync(certificateId);
        if (result.Success)
            return Ok(result);

        return result.Message == "Certificate not found" ? NotFound(result) : BadRequest(result);
    }

    /// <summary>
    /// Regenerate missing certificate documents for legacy certificates (Admin only)
    /// </summary>
    [HttpPost("admin/regenerate-missing-documents")]
    [Authorize(Roles = "Admin")]
    [ProducesResponseType(typeof(BaseResponse<CertificateBulkRegenerationResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(BaseResponse<string>), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(BaseResponse<string>), StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> RegenerateMissingDocuments()
    {
        var result = await _certificateService.RegenerateMissingCertificateDocumentsAsync();
        return result.Success ? Ok(result) : BadRequest(result);
    }

    /// <summary>
    /// Regenerate a certificate document by certificate id (Admin only)
    /// </summary>
    [HttpPost("admin/{certificateId:guid}/regenerate")]
    [Authorize(Roles = "Admin")]
    [ProducesResponseType(typeof(BaseResponse<CertificateResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(BaseResponse<string>), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(BaseResponse<string>), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(BaseResponse<string>), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> RegenerateCertificateById(Guid certificateId)
    {
        var result = await _certificateService.RegenerateCertificateByIdAsync(certificateId);
        if (result.Success)
            return Ok(result);

        return result.Message == "Certificate not found" ? NotFound(result) : BadRequest(result);
    }

    /// <summary>
    /// Regenerate a certificate document by certificate number (Admin only)
    /// </summary>
    [HttpPost("admin/regenerate/{certificateNumber}")]
    [Authorize(Roles = "Admin")]
    [ProducesResponseType(typeof(BaseResponse<CertificateResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(BaseResponse<string>), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(BaseResponse<string>), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(BaseResponse<string>), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> RegenerateCertificateByNumber(string certificateNumber)
    {
        var result = await _certificateService.RegenerateCertificateByNumberAsync(certificateNumber);
        if (result.Success)
            return Ok(result);

        return result.Message == "Certificate not found" ? NotFound(result) : BadRequest(result);
    }

    /// <summary>
    /// Verify a certificate by verification code
    /// </summary>
    [HttpGet("verify/{verificationCode}")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(BaseResponse<CertificateVerificationResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(BaseResponse<string>), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Verify(string verificationCode)
    {
        var result = await _certificateService.VerifyCertificateAsync(verificationCode);
        return result.Success ? Ok(result) : NotFound(result);
    }
}
