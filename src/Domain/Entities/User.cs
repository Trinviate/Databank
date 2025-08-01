

namespace DatabankApi.Domain.Entities;

public class User
{
    public Guid UserId { get; init; }
    public string Username { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Department { get; set; } = string.Empty;
    public DateOnly CreatedAt { get; init; }
    public DateOnly UpdatedAt { get; init; }
}


