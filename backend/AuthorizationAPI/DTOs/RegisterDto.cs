using System.ComponentModel.DataAnnotations;

namespace AuthorizationAPI;

public class RegisterDto
{
    [Required]
    public string Username { get; set; }
    [Required]
    [StringLength(16,MinimumLength = 8)]
    public string Password { get; set; }
}
