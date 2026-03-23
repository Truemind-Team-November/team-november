using LMS.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

public class CourseConfiguration : IEntityTypeConfiguration<Course>
{
    public void Configure(EntityTypeBuilder<Course> builder)
    {
        builder.HasKey(x => x.Id);

        // 🔹 Title
        builder.Property(x => x.Title)
               .IsRequired()
               .HasMaxLength(200);

        // 🔹 Description
        builder.Property(x => x.Description)
               .IsRequired()
               .HasMaxLength(1000);

        // 🔹 Instructor relationship (VERY IMPORTANT)
        builder.HasOne(x => x.Instructor)
               .WithMany()
               .HasForeignKey(x => x.InstructorId)
               .OnDelete(DeleteBehavior.Restrict);

        // 🔹 Audit fields
        builder.Property(x => x.CreatedAt)
               .IsRequired();

        builder.Property(x => x.UpdatedAt);

        // 🔥 Lessons (backing field)
        builder.HasMany(x => x.Lessons)
       .WithOne(x => x.Course)
       .HasForeignKey(x => x.CourseId)
       .OnDelete(DeleteBehavior.Cascade);

        builder.Navigation(x => x.Lessons)
               .UsePropertyAccessMode(PropertyAccessMode.Field);

        // 🔥 Enrollments (backing field)
        builder.HasMany(x => x.Enrollments)
       .WithOne(x => x.Course)
       .HasForeignKey(x => x.CourseId)
       .OnDelete(DeleteBehavior.Cascade);

        builder.Navigation(x => x.Enrollments)
               .UsePropertyAccessMode(PropertyAccessMode.Field);

       builder.Metadata
             .FindNavigation(nameof(Course.Lessons))!
             .SetField("_lessons");

      builder.Metadata
            .FindNavigation(nameof(Course.Enrollments))!
            .SetField("_enrollments");

        // 🔥 Ignore computed property
        builder.Ignore(x => x.LessonCount);
    }
}

