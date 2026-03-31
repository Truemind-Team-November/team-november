using LMS.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

public class DiscussionPostTagConfiguration : IEntityTypeConfiguration<DiscussionPostTag>
{
    public void Configure(EntityTypeBuilder<DiscussionPostTag> builder)
    {
        builder.HasKey(x => new { x.PostId, x.TagId });

        builder.HasOne(x => x.Post)
            .WithMany(x => x.PostTags)
            .HasForeignKey(x => x.PostId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(x => x.Tag)
            .WithMany(x => x.PostTags)
            .HasForeignKey(x => x.TagId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
