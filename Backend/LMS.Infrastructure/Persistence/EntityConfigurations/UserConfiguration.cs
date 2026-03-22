using LMS.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

public class UserConfiguration : IEntityTypeConfiguration<User>
{
    public void Configure(EntityTypeBuilder<User> builder)
    {
        builder.HasKey(x => x.Id);

        // FirstName
        builder.Property(x => x.FirstName)
               .IsRequired()
               .HasMaxLength(100);

        // LastName
        builder.Property(x => x.LastName)
               .IsRequired()
               .HasMaxLength(100);

        // Email
        builder.Property(x => x.Email)
               .IsRequired()
               .HasMaxLength(150);

        builder.Ignore(x => x.FullName);

        builder.HasIndex(x => x.Email)
               .IsUnique();

        // PasswordHash
        builder.Property(x => x.PasswordHash)
               .IsRequired();

        // Role (store as string)
        builder.Property(x => x.Role)
               .HasConversion<string>()
               .IsRequired();

        // Audit fields
        builder.Property(x => x.CreatedAt)
               .IsRequired();

        builder.Property(x => x.UpdatedAt);

        // Enrollment relationship (VERY IMPORTANT)
        builder.HasMany(x => x.Enrollments)
               .WithOne(x => x.User)
               .HasForeignKey(x => x.UserId)
               .OnDelete(DeleteBehavior.Cascade);

        // 🔥 Backing field (best practice)
        builder.Navigation(x => x.Enrollments)
               .UsePropertyAccessMode(PropertyAccessMode.Field);
    }
}