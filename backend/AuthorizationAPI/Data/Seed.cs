using Microsoft.AspNetCore.Identity;

namespace AuthorizationAPI;

public class Seed
{
    public static async Task SeedAdminUserAndRoles(UserManager<AppUser> userManager, RoleManager<AppRole> roleManager)
    {
        if (roleManager.Roles.Any())
            return;

        var roles = new List<AppRole>
        {
            new AppRole{ Name = "Member"},
            new AppRole{ Name = "Admin"},
            new AppRole{ Name = "Creator"},
        };

        foreach (var role in roles)
        {
            await roleManager.CreateAsync(role);
        }

        var admin = new AppUser
        {
            UserName = "admin",
        };

        await userManager.CreateAsync(admin, "Pa$$w0rd");
        await userManager.AddToRolesAsync(admin, new[] { "Admin", "Creator" });

        var testUser = new AppUser
        {
            UserName = "testUser",
        };

        await userManager.CreateAsync(testUser, "Pa$$w0rd");
        await userManager.AddToRolesAsync(testUser, new[] { "Member"});
    }

}
