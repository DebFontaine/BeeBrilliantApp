using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

namespace AuthorizationAPI;

public class TokenService : ITokenService
{
    private readonly SymmetricSecurityKey _key;
    private readonly UserManager<AppUser> _userManager;
    private readonly JwtOptions _jwtOptions;
    public TokenService(IConfiguration config, UserManager<AppUser> userManager, IOptions<JwtOptions> jwtOptions)
    {
        _key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["TokenKey"]));
        _userManager = userManager;
        _jwtOptions = jwtOptions.Value;
    }
    public async Task<string> CreateToken(AppUser user)
    {
        var claims = new List<Claim>()
        {
            new Claim(JwtRegisteredClaimNames.NameId, user.UserName),
            new Claim(JwtRegisteredClaimNames.UniqueName, user.UserName),
        };

        //add roles to token
        var roles = await _userManager.GetRolesAsync(user);
        claims.AddRange(roles.Select(role => new Claim(ClaimTypes.Role, role)));

        var creds = new SigningCredentials(_key, SecurityAlgorithms.HmacSha512);
        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Audience = _jwtOptions.Audience,
            Issuer = _jwtOptions.Issuer,
            Subject = new ClaimsIdentity(claims),
            Expires = DateTime.Now.AddDays(7),
            SigningCredentials = creds
        };

        var tokenhandler = new JwtSecurityTokenHandler();
        var token = tokenhandler.CreateToken(tokenDescriptor);

        return tokenhandler.WriteToken(token);
    }
}
/* public class PasswordResetTokenProvider<TUser> : DataProtectorTokenProvider<TUser> where TUser : class
{
    public PasswordResetTokenProvider(IDataProtectionProvider dataProtectionProvider,
        IOptions<PasswordResetTokenProviderOptions> options,
        ILogger<DataProtectorTokenProvider<TUser>> logger)
        : base(dataProtectionProvider, options, logger)
    {

    }
}

public class PasswordResetTokenProviderOptions : DataProtectionTokenProviderOptions
{
    public PasswordResetTokenProviderOptions()
    {
        Name = "PasswordResetTokenProvider";
        TokenLifespan = TimeSpan.FromDays(3);
    }
}
 */