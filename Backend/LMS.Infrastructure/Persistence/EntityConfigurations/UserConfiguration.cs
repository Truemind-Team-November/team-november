using LMS.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

public class UserConfiguration : IEntityTypeConfiguration<User>
{
    public void Configure(EntityTypeBuilder<User> builder)
    {
        builder.HasKey(x => x.Id);

        builder.Property(x => x.FirstName)
               .IsRequired()
               .HasMaxLength(100);

        builder.Property(x => x.LastName)
               .IsRequired()
               .HasMaxLength(100);

        builder.Property(x => x.Email)
               .IsRequired()
               .HasMaxLength(150);

        builder.HasIndex(x => x.Email)
               .IsUnique();

        builder.Property(x => x.PasswordHash)
               .IsRequired();

        // Enum as string
        builder.Property(x => x.Role)
               .HasConversion<string>()
               .IsRequired();

        // Audit
        builder.Property(x => x.CreatedAt).IsRequired();
        builder.Property(x => x.UpdatedAt);

        //  Soft delete index
        builder.HasIndex(x => x.IsDeleted);

        // Relationship
        builder.HasMany(x => x.Enrollments)
               .WithOne(x => x.User)
               .HasForeignKey(x => x.UserId)
               .OnDelete(DeleteBehavior.Cascade);

        // Backing field
        builder.Navigation(x => x.Enrollments)
               .UsePropertyAccessMode(PropertyAccessMode.Field);

        builder.Metadata
               .FindNavigation(nameof(User.Enrollments))!
               .SetField("_enrollments");

        // Ignore computed + helper methods
        builder.Ignore(x => x.FullName);
      
    }
}