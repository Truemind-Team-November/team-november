namespace LMS.Application.Common.Options;

public class CertificateOptions
{
    public const string SectionName = "Certificates";

    public string IssuerName { get; set; } = "TalentFlow";
    public string IssuerTitle { get; set; } = "Learning Administration";
    public string TemplateVersion { get; set; } = "v1";
    public string VerificationBaseUrl { get; set; } = "https://api.talentflow.com";
    public SignatureOptions Signature { get; set; } = new();
}
