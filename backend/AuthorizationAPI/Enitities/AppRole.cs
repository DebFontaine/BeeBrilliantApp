using Microsoft.AspNetCore.Identity;

namespace AuthorizationAPI;

public class AppRole : IdentityRole<int>
{
    public ICollection<AppUserRole> UserRoles { get; set; }
}
