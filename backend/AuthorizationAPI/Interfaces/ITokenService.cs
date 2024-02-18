namespace AuthorizationAPI;

public interface ITokenService
{
    Task<string> CreateToken(AppUser user);
}
