using System.Text;
using System.Text.Json.Serialization;
using FluentValidation;
using FluentValidation.AspNetCore;
using LMS.Api.Extensions;
using LMS.Application.Common.Options;
using LMS.Application.Interfaces.Repositories;
using LMS.Application.Interfaces.Services;
using LMS.Application.Services;
using LMS.Application.Validators.Lesson;
using LMS.Domain.Entities;
using LMS.Domain.Enums;
using LMS.Infrastructure.Persistence;
using LMS.Infrastructure.Repositories;
using LMS.Infrastructure.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

// Register DbCommandCounterInterceptor as singleton
builder.Services.AddSingleton<DbCommandCounterInterceptor>();

// 🔹 1. Add Persistence (EF Core + Npgsql)
builder.Services.AddDbContext<ApplicationDbContext>((serviceProvider, options) =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection"))
           .AddInterceptors(serviceProvider.GetRequiredService<DbCommandCounterInterceptor>()));

// 🔹 2. Register Repositories
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<ICourseBrowseRepository, CourseBrowseRepository>();
builder.Services.AddScoped<IDashboardRepository, DashboardRepository>();
builder.Services.AddScoped<IDiscussionRepository, DiscussionRepository>();
builder.Services.AddScoped<IInstructorRoleRequestRepository, InstructorRoleRequestRepository>();
builder.Services.AddScoped<INotificationRepository, NotificationRepository>();
builder.Services.AddScoped<IProfileRepository, ProfileRepository>();
builder.Services.AddScoped<ITeamRepository, TeamRepository>();
builder.Services.AddScoped<IDisciplineRepository, DisciplineRepository>();
builder.Services.AddScoped<ICourseRepository, CourseRepository>();
builder.Services.AddScoped<ICourseReviewRepository, CourseReviewRepository>();
builder.Services.AddScoped<ILessonRepository, LessonRepository>();
builder.Services.AddScoped<ILessonNoteRepository, LessonNoteRepository>();
builder.Services.AddScoped<IEnrollmentRepository, EnrollmentRepository>();
builder.Services.AddScoped<IProgressRepository, ProgressRepository>();
builder.Services.AddScoped<ILessonProgressRepository, LessonProgressRepository>();
builder.Services.AddScoped<IAssignmentRepository, AssignmentRepository>();
builder.Services.AddScoped<ISubmissionRepository, SubmissionRepository>();
builder.Services.AddScoped<ICertificateRepository, CertificateRepository>();
builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();

// 🔹 3. Register Services
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IDashboardService, DashboardService>();
builder.Services.AddScoped<IDiscussionService, DiscussionService>();
builder.Services.AddScoped<IRoleManagementService, RoleManagementService>();
builder.Services.AddScoped<INotificationService, NotificationService>();
builder.Services.AddScoped<IProfileService, ProfileService>();
builder.Services.AddScoped<ITeamService, TeamService>();
builder.Services.AddScoped<ICourseService, CourseService>();
builder.Services.AddScoped<ILessonService, LessonService>();
builder.Services.AddScoped<IEnrollmentService, EnrollmentService>();
builder.Services.AddScoped<IProgressService, ProgressService>();
builder.Services.AddScoped<IAssignmentService, AssignmentService>();
builder.Services.AddScoped<ICertificateService, CertificateService>();
builder.Services.AddScoped<IEmailService, EmailService>();
builder.Services.AddScoped<ISubmissionService, SubmissionService>();
builder.Services.AddHttpClient<ICertificateDocumentService, CertificateDocumentService>();
builder.Services.AddScoped<IBackgroundJobDispatcher, InlineBackgroundJobDispatcher>();
builder.Services.AddHttpClient<IFileStorageService, CloudinaryFileStorageService>();
builder.Services.AddHostedService<TokenCleanupService>();
builder.Services.AddScoped<IPasswordResetTokenRepository, PasswordResetTokenRepository>();

// 🔹 4. Shared Infrastructure
builder.Services.AddHttpContextAccessor();
builder.Services.AddScoped<ICurrentUserService, CurrentUserService>();
builder.Services.AddScoped<IPasswordHasher, PasswordHasher>();
builder.Services.AddScoped<IJwtService, JwtService>();
builder.Services.AddScoped<IGoogleTokenValidator, GoogleTokenValidator>();

// 🔹 5. Validation (FluentValidation)
builder.Services.AddFluentValidationAutoValidation();
builder.Services.AddValidatorsFromAssemblyContaining<CreateLessonRequestValidator>();

// 🔹 6. JWT Authentication
var jwtSection = builder.Configuration.GetSection("Jwt");
builder.Services.AddOptions<FileStorageOptions>()
    .Bind(builder.Configuration.GetSection(FileStorageOptions.SectionName));
builder.Services.AddOptions<CertificateOptions>()
    .Bind(builder.Configuration.GetSection(CertificateOptions.SectionName))
    .Validate(options => !string.IsNullOrWhiteSpace(options.IssuerName), "Certificates:IssuerName is required")
    .Validate(options => !string.IsNullOrWhiteSpace(options.IssuerTitle), "Certificates:IssuerTitle is required")
    .Validate(options => !string.IsNullOrWhiteSpace(options.TemplateVersion), "Certificates:TemplateVersion is required")
    .Validate(options => Uri.TryCreate(options.VerificationBaseUrl, UriKind.Absolute, out _), "Certificates:VerificationBaseUrl must be a valid absolute URL")
    .Validate(options => options.Signature != null, "Certificates:Signature is required")
    .Validate(options => !string.IsNullOrWhiteSpace(options.Signature?.Name), "Certificates:Signature:Name is required")
    .Validate(options => !string.IsNullOrWhiteSpace(options.Signature?.Title), "Certificates:Signature:Title is required")
    .Validate(options => Uri.TryCreate(options.Signature?.ImageUrl, UriKind.Absolute, out _), "Certificates:Signature:ImageUrl must be a valid absolute URL")
    .ValidateOnStart();
builder.Services.Configure<GoogleAuthOptions>(builder.Configuration.GetSection(GoogleAuthOptions.SectionName));
builder.Services.Configure<JwtOptions>(jwtSection);
var secret = jwtSection["Secret"];
if (string.IsNullOrWhiteSpace(secret))
{
    throw new InvalidOperationException("JWT Secret is not configured");
}

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    var jwtConfig = builder.Configuration.GetSection("Jwt");
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwtConfig["Issuer"],
        ValidAudience = jwtConfig["Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtConfig["Secret"]!)),
        ClockSkew = TimeSpan.Zero
    };
})
.AddGoogle(googleOptions =>
{
    googleOptions.ClientId = builder.Configuration["Authentication:Google:ClientId"];
    googleOptions.ClientSecret = builder.Configuration["Authentication:Google:ClientSecret"];
    googleOptions.CallbackPath = "/signin-google";
});

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
    });

// 🔹 7. Swagger (with JWT Support)
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "LMS API", Version = "v1" });
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme. Example: \"Bearer {token}\"",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });
    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference { Type = ReferenceType.SecurityScheme, Id = "Bearer" }
            },
            Array.Empty<string>()
        }
    });
});

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

// Development-only request timing & SQL count middleware
if (app.Environment.IsDevelopment())
{
    app.Use(async (context, next) =>
    {
        var sw = System.Diagnostics.Stopwatch.StartNew();
        DbCommandCounterInterceptor.Reset();
        await next();
        sw.Stop();
        var dbCount = DbCommandCounterInterceptor.GetCount();
        var logger = app.Services.GetRequiredService<ILogger<Program>>();
        logger.LogInformation("Request {method} {path} completed in {ms} ms and executed {db} SQL commands", context.Request.Method, context.Request.Path, sw.ElapsedMilliseconds, dbCount);
    });
}

using (var scope = app.Services.CreateScope())
{
    try
    {
        var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
        var hasher = scope.ServiceProvider.GetRequiredService<IPasswordHasher>();

        EnsureLegacyDisciplineSchemaCompatibility(db);
        db.Database.Migrate();
        EnsureLegacyDisciplineSchemaCompatibility(db);

        SeedBootstrapAdmin(db, hasher, builder.Configuration);
    }
    catch (Exception ex)
    {
        var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();
        logger.LogError(ex, "Migration failed");
    }
}

app.UseSwagger();
app.UseSwaggerUI();

if (!app.Environment.IsDevelopment())
{
    app.UseHsts();
}

app.UseGlobalExceptionHandler();
app.UseHttpsRedirection();
app.UseRequestResponseLogging();
app.UseCors("AllowAll");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();

static void SeedBootstrapAdmin(ApplicationDbContext db, IPasswordHasher hasher, IConfiguration configuration)
{
    if (db.Users.Any(user => user.Role == UserRole.Admin))
        return;

    var bootstrapSection = configuration.GetSection("BootstrapAdmin");
    var adminFirstName = bootstrapSection["FirstName"] ?? "Amina";
    var adminLastName = bootstrapSection["LastName"] ?? "Okafor";
    var adminEmail = bootstrapSection["Email"] ?? "admin@talentflow.demo";
    var adminPassword = bootstrapSection["Password"] ?? "Admin@123";

    var admin = User.Create(
        adminFirstName,
        adminLastName,
        adminEmail,
        string.Empty,
        hasher.HashPassword(adminPassword),
        UserRole.Admin,
        null
    );

    db.Users.Add(admin);
    db.SaveChanges();
}

static void EnsureLegacyDisciplineSchemaCompatibility(ApplicationDbContext db)
{
    db.Database.ExecuteSqlRaw("""
        DO $$
        BEGIN
            IF EXISTS (
                SELECT 1
                FROM information_schema.columns
                WHERE table_schema = 'public'
                  AND table_name = 'Disciplines'
                  AND column_name = 'TeamId'
            ) THEN
                ALTER TABLE "Disciplines" DROP CONSTRAINT IF EXISTS "FK_Disciplines_Teams_TeamId";
                DROP INDEX IF EXISTS "IX_Disciplines_TeamId";
                ALTER TABLE "Disciplines" DROP COLUMN "TeamId";
            END IF;
        END
        $$;
        """);
}
