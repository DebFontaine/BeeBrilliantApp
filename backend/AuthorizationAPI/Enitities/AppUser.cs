using Microsoft.AspNetCore.Identity;

namespace AuthorizationAPI;

public class AppUser : IdentityUser<int>
{
    public ICollection<AppUserRole> UserRoles {get; set;}
}
