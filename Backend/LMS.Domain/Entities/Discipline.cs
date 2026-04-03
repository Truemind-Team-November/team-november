namespace LMS.Domain.Entities;

public class Discipline : BaseEntity
{
    public string Name { get; private set; } = default!;
    public Guid TeamId { get; private set; }
    public Team Team { get; private set; } = default!;

    private Discipline() { }

    public static Discipline Create(string name, Guid teamId)
    {
        if (string.IsNullOrWhiteSpace(name))
            throw new ArgumentException("Discipline name is required");

        if (teamId == Guid.Empty)
            throw new ArgumentException("Team is required");

        return new Discipline
        {
            Name = name.Trim(),
            TeamId = teamId
        };
    }

    public void Update(string name, Guid teamId)
    {
        if (string.IsNullOrWhiteSpace(name))
            throw new ArgumentException("Discipline name is required");

        if (teamId == Guid.Empty)
            throw new ArgumentException("Team is required");

        Name = name.Trim();
        TeamId = teamId;
        SetUpdated();
    }
}
