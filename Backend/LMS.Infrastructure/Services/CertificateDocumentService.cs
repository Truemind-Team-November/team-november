using System.Text.RegularExpressions;
using LMS.Application.Common.Certificates;
using LMS.Application.Common.Options;
using LMS.Application.Interfaces.Services;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using QRCoder;
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;

namespace LMS.Infrastructure.Services;

public class CertificateDocumentService : ICertificateDocumentService
{
    private readonly HttpClient _httpClient;
    private readonly CertificateOptions _options;
    private readonly ILogger<CertificateDocumentService> _logger;

    public CertificateDocumentService(
        HttpClient httpClient,
        IOptions<CertificateOptions> options,
        ILogger<CertificateDocumentService> logger)
    {
        _httpClient = httpClient;
        _options = options.Value;
        _logger = logger;
        QuestPDF.Settings.License = LicenseType.Community;
    }

    public async Task<GeneratedCertificateDocument> GenerateAsync(
        CertificateDocumentData documentData,
        CancellationToken cancellationToken = default)
    {
        cancellationToken.ThrowIfCancellationRequested();

        var verificationUrl = BuildVerificationUrl(documentData.VerificationCode);
        var qrCodeBytes = GenerateQrCode(verificationUrl);
        var signatureImageBytes = await LoadSignatureImageAsync(cancellationToken);
        var fileName = BuildFileName(documentData.CertificateNumber, documentData.RecipientFullName, documentData.CourseTitle);

        byte[] pdfBytes;
        try
        {
            pdfBytes = BuildPdf(documentData, verificationUrl, qrCodeBytes, signatureImageBytes);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to generate certificate PDF for {CertificateNumber}", documentData.CertificateNumber);
            throw new InvalidOperationException("Certificate PDF generation failed", ex);
        }

        return new GeneratedCertificateDocument(
            pdfBytes,
            fileName,
            "application/pdf",
            verificationUrl,
            NormalizeTemplateVersion(documentData.TemplateVersion));
    }

    public string BuildVerificationUrl(string verificationCode)
    {
        if (string.IsNullOrWhiteSpace(verificationCode))
            throw new ArgumentException("Verification code is required", nameof(verificationCode));

        var baseUrl = _options.VerificationBaseUrl.Trim().TrimEnd('/');
        return $"{baseUrl}/api/certificate/verify/{Uri.EscapeDataString(verificationCode.Trim())}";
    }

    private async Task<byte[]> LoadSignatureImageAsync(CancellationToken cancellationToken)
    {
        try
        {
            using var response = await _httpClient.GetAsync(_options.Signature.ImageUrl, cancellationToken);
            if (!response.IsSuccessStatusCode)
            {
                _logger.LogError(
                    "Failed to fetch certificate signature image. Status: {StatusCode}, Url: {Url}",
                    response.StatusCode,
                    _options.Signature.ImageUrl);
                throw new InvalidOperationException("Certificate signature image could not be loaded");
            }

            return await response.Content.ReadAsByteArrayAsync(cancellationToken);
        }
        catch (InvalidOperationException)
        {
            throw;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching certificate signature image from {Url}", _options.Signature.ImageUrl);
            throw new InvalidOperationException("Certificate signature image could not be loaded", ex);
        }
    }

    private byte[] BuildPdf(
        CertificateDocumentData documentData,
        string verificationUrl,
        byte[] qrCodeBytes,
        byte[] signatureImageBytes)
    {
        return NormalizeTemplateVersion(documentData.TemplateVersion) switch
        {
            "v2" => BuildModernTemplate(documentData, verificationUrl, qrCodeBytes, signatureImageBytes),
            _ => BuildClassicTemplate(documentData, verificationUrl, qrCodeBytes, signatureImageBytes)
        };
    }

    private byte[] BuildClassicTemplate(
        CertificateDocumentData documentData,
        string verificationUrl,
        byte[] qrCodeBytes,
        byte[] signatureImageBytes)
    {
        return Document.Create(container =>
        {
            container.Page(page =>
            {
                page.Size(PageSizes.A4);
                page.Margin(28);
                page.PageColor(Colors.White);
                page.DefaultTextStyle(x => x.FontSize(12).FontColor(Colors.Grey.Darken4));

                page.Header()
                    .Height(18)
                    .Background(Colors.Blue.Darken2);

                page.Content()
                    .PaddingVertical(18)
                    .Border(1)
                    .BorderColor(Colors.Grey.Lighten2)
                    .Padding(28)
                    .Column(column =>
                    {
                        column.Spacing(18);

                        column.Item().AlignCenter().Text("CERTIFICATE OF COMPLETION")
                            .FontSize(28)
                            .Bold()
                            .FontColor(Colors.Blue.Darken3);

                        column.Item().AlignCenter().Text($"{documentData.IssuedBy} Learning Experience")
                            .FontSize(14)
                            .SemiBold()
                            .FontColor(Colors.Grey.Darken2);

                        column.Item().PaddingTop(8).AlignCenter().Text("This is proudly presented to")
                            .FontSize(14)
                            .FontColor(Colors.Grey.Darken2);

                        column.Item().AlignCenter().Text(documentData.RecipientFullName)
                            .FontSize(32)
                            .Bold()
                            .FontColor(Colors.Grey.Darken4);

                        column.Item().AlignCenter().Text(text =>
                        {
                            text.DefaultTextStyle(TextStyle.Default.FontSize(14));
                            text.Span("for successfully completing ");
                            text.Span(documentData.CourseTitle).SemiBold();
                            text.Span(" and meeting the assessment requirements of the program.");
                        });

                        column.Item().Background(Colors.Grey.Lighten4).Padding(18).Row(row =>
                        {
                            row.Spacing(20);

                            row.RelativeItem().Column(details =>
                            {
                                details.Spacing(10);
                                details.Item().Text($"Certificate No: {documentData.CertificateNumber}").SemiBold();
                                details.Item().Text($"Learner ID: {documentData.RecipientPublicId}");
                                details.Item().Text($"Discipline: {documentData.RecipientDiscipline}");
                                details.Item().Text($"Cohort: {documentData.RecipientCohortLabel ?? "Not specified"}");
                                details.Item().Text($"Final Score: {documentData.FinalScore:0.##}%");
                                details.Item().Text($"Completed On: {(documentData.CompletedAt ?? documentData.IssuedAt):MMMM dd, yyyy}");
                                details.Item().Text($"Issued On: {documentData.IssuedAt:MMMM dd, yyyy}");
                            });

                            row.ConstantItem(120).Column(qr =>
                            {
                                qr.Spacing(8);
                                qr.Item()
                                    .Border(1)
                                    .BorderColor(Colors.Grey.Lighten2)
                                    .Padding(6)
                                    .Background(Colors.White)
                                    .Image(qrCodeBytes);
                                qr.Item().AlignCenter().Text("Scan to verify")
                                    .FontSize(10)
                                    .SemiBold()
                                    .FontColor(Colors.Grey.Darken2);
                            });
                        });

                        column.Item().PaddingTop(4).Row(row =>
                        {
                            row.RelativeItem().Column(left =>
                            {
                                left.Spacing(6);
                                left.Item().PaddingBottom(6).BorderBottom(1).BorderColor(Colors.Grey.Lighten2);
                                left.Item().Text(documentData.IssuedBy).SemiBold();
                                left.Item().Text(_options.IssuerTitle).FontSize(11).FontColor(Colors.Grey.Darken2);
                            });

                            row.ConstantItem(40);

                            row.RelativeItem().Column(right =>
                            {
                                right.Spacing(8);
                                right.Item().PaddingBottom(6).BorderBottom(1).BorderColor(Colors.Grey.Lighten2);
                                right.Item().Height(42).Image(signatureImageBytes);
                                right.Item().Text(_options.Signature.Name).SemiBold();
                                right.Item().Text(_options.Signature.Title).FontSize(11).FontColor(Colors.Grey.Darken2);
                            });
                        });
                    });

                page.Footer().AlignCenter().Text(text =>
                {
                    text.DefaultTextStyle(TextStyle.Default.FontSize(10).FontColor(Colors.Grey.Darken2));
                    text.Span("Verification URL: ").SemiBold();
                    text.Span(verificationUrl);
                });
            });
        }).GeneratePdf();
    }

    private byte[] BuildModernTemplate(
        CertificateDocumentData documentData,
        string verificationUrl,
        byte[] qrCodeBytes,
        byte[] signatureImageBytes)
    {
        return Document.Create(container =>
        {
            container.Page(page =>
            {
                page.Size(PageSizes.A4);
                page.Margin(24);
                page.PageColor(Colors.White);
                page.DefaultTextStyle(x => x.FontSize(12).FontColor(Colors.Grey.Darken4));
                page.Content()
                    .Background(Colors.Blue.Lighten5)
                    .Padding(20)
                    .Column(column =>
                    {
                        column.Spacing(20);

                        column.Item().Row(row =>
                        {
                            row.RelativeItem().Column(header =>
                            {
                                header.Spacing(6);
                                header.Item().Text("Certificate")
                                    .FontSize(16)
                                    .SemiBold()
                                    .FontColor(Colors.Blue.Darken2);
                                header.Item().Text("OF ACHIEVEMENT")
                                    .FontSize(32)
                                    .Bold()
                                    .FontColor(Colors.Grey.Darken4);
                            });

                            row.ConstantItem(90).Column(qr =>
                            {
                                qr.Item().AlignRight().Height(72).Image(qrCodeBytes);
                                qr.Item().AlignRight().Text("Verify")
                                    .FontSize(10)
                                    .SemiBold()
                                    .FontColor(Colors.Grey.Darken2);
                            });
                        });

                        column.Item().Border(1).BorderColor(Colors.Blue.Lighten3).Padding(24).Column(body =>
                        {
                            body.Spacing(16);
                            body.Item().Text($"Awarded by {documentData.IssuedBy}")
                                .FontSize(13)
                                .FontColor(Colors.Grey.Darken2);

                            body.Item().Text(documentData.RecipientFullName)
                                .FontSize(30)
                                .Bold()
                                .FontColor(Colors.Blue.Darken3);

                            body.Item().Text(text =>
                            {
                                text.DefaultTextStyle(TextStyle.Default.FontSize(14));
                                text.Span("in recognition of successful completion of ");
                                text.Span(documentData.CourseTitle).SemiBold();
                                text.Span(" with all required coursework, assessments, and completion milestones satisfied.");
                            });

                            body.Item().PaddingVertical(8).Row(row =>
                            {
                                row.Spacing(14);

                                row.RelativeItem().Background(Colors.White).Border(1).BorderColor(Colors.Grey.Lighten2).Padding(14).Column(details =>
                                {
                                    details.Spacing(8);
                                    details.Item().Text($"Certificate No: {documentData.CertificateNumber}").SemiBold();
                                    details.Item().Text($"Learner ID: {documentData.RecipientPublicId}");
                                    details.Item().Text($"Discipline: {documentData.RecipientDiscipline}");
                                    details.Item().Text($"Cohort: {documentData.RecipientCohortLabel ?? "Not specified"}");
                                });

                                row.RelativeItem().Background(Colors.White).Border(1).BorderColor(Colors.Grey.Lighten2).Padding(14).Column(metrics =>
                                {
                                    metrics.Spacing(8);
                                    metrics.Item().Text($"Final Score: {documentData.FinalScore:0.##}%").SemiBold();
                                    metrics.Item().Text($"Completed On: {(documentData.CompletedAt ?? documentData.IssuedAt):MMMM dd, yyyy}");
                                    metrics.Item().Text($"Issued On: {documentData.IssuedAt:MMMM dd, yyyy}");
                                    metrics.Item().Text($"Template: {NormalizeTemplateVersion(documentData.TemplateVersion)}");
                                });
                            });

                            body.Item().PaddingTop(12).Row(row =>
                            {
                                row.RelativeItem().Column(signature =>
                                {
                                    signature.Spacing(6);
                                    signature.Item().Text("Authorized Signature")
                                        .FontSize(10)
                                        .SemiBold()
                                        .FontColor(Colors.Grey.Darken2);
                                    signature.Item().Height(42).Image(signatureImageBytes);
                                    signature.Item().Text(_options.Signature.Name).SemiBold();
                                    signature.Item().Text(_options.Signature.Title).FontSize(11).FontColor(Colors.Grey.Darken2);
                                });

                                row.RelativeItem().Column(verify =>
                                {
                                    verify.Spacing(6);
                                    verify.Item().AlignRight().Text("Digital Verification")
                                        .FontSize(10)
                                        .SemiBold()
                                        .FontColor(Colors.Grey.Darken2);
                                    verify.Item().AlignRight().Text(verificationUrl)
                                        .FontSize(10)
                                        .FontColor(Colors.Blue.Darken2);
                                });
                            });
                        });
                    });
            });
        }).GeneratePdf();
    }

    private static byte[] GenerateQrCode(string verificationUrl)
    {
        using var qrGenerator = new QRCodeGenerator();
        using var qrCodeData = qrGenerator.CreateQrCode(verificationUrl, QRCodeGenerator.ECCLevel.Q);
        var qrCode = new PngByteQRCode(qrCodeData);
        return qrCode.GetGraphic(20);
    }

    private static string BuildFileName(string certificateNumber, string recipientFullName, string courseTitle)
    {
        var learnerSegment = SanitizeFileName(recipientFullName);
        var courseSegment = SanitizeFileName(courseTitle);
        return $"{certificateNumber}-{learnerSegment}-{courseSegment}.pdf";
    }

    private static string SanitizeFileName(string value)
    {
        var normalized = Regex.Replace(value.Trim().ToLowerInvariant(), @"[^a-z0-9]+", "-");
        normalized = Regex.Replace(normalized, "-{2,}", "-").Trim('-');
        return string.IsNullOrWhiteSpace(normalized) ? "certificate" : normalized;
    }

    private static string NormalizeTemplateVersion(string? templateVersion)
    {
        return string.IsNullOrWhiteSpace(templateVersion) ? "v1" : templateVersion.Trim().ToLowerInvariant();
    }
}
