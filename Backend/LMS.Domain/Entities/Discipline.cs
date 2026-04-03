namespace LMS.Domain.Entities;

public class Discipline : BaseEntity
{
    public string Name { get; private set; } = default!;

    private Discipline() { }

    public static Discipline Create(string name)
    {
        if (string.IsNullOrWhiteSpace(name))
            throw new ArgumentException("Discipline name is required");

        return new Discipline
        {
            Name = name.Trim()
        };
    }

    public void Update(string name)
    {
        if (string.IsNullOrWhiteSpace(name))
            throw new ArgumentException("Discipline name is required");

        Name = name.Trim();
        SetUpdated();
    }
}
