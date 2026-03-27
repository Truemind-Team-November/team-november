using System.Net;
using System.Net.Mail;
using LMS.Application.Interfaces.Services;
using Microsoft.Extensions.Configuration;

namespace LMS.Application.Services;

public class EmailService : IEmailService
{
    private readonly IConfiguration _config;

    public EmailService(IConfiguration config)
    {
        _config = config;
    }

    public async Task SendEmailAsync(string to, string subject, string htmlContent)
    {
        var smtpClient = new SmtpClient(_config["Email:SmtpHost"])
        {
            Port = int.Parse(_config["Email:Port"]),
            Credentials = new NetworkCredential(
                _config["Email:Username"],
                _config["Email:Password"]),
            EnableSsl = true
        };

        var mail = new MailMessage
        {
            From = new MailAddress(_config["Email:From"]),
            Subject = subject,             
            Body = htmlContent,          
            IsBodyHtml = true         
        };

        mail.To.Add(to);         

        await smtpClient.SendMailAsync(mail);
    }
}