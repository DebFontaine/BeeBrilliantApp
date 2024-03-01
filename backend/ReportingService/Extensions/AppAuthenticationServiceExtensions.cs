using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;

namespace ReportingService;

public static class AppAuthenticationServiceExtensions
{
    public static IServiceCollection AddAppAuthetication(this IServiceCollection services, IConfiguration configuration)
    {
        services.Configure<JwtOptions>(configuration.GetSection("ApiSettings:JwtOptions"));

        services.AddAuthentication(options =>
        {
            options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
            options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
        }).AddJwtBearer(options =>
        {
            options.TokenValidationParameters = GetTokenValidationParameters(configuration);
        });

        return services;  
    }
    private static TokenValidationParameters GetTokenValidationParameters(IConfiguration configuration)
    {
        var jwtOptions = configuration.GetSection("ApiSettings:JwtOptions").Get<JwtOptions>();
        if (jwtOptions == null)
        {
            throw new InvalidOperationException("JwtOptions configuration is missing or invalid.");
        }

        var key = Encoding.ASCII.GetBytes(jwtOptions.Secret);

        return new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(key),
            ValidateIssuer = true,
            ValidIssuer = jwtOptions.Issuer,
            ValidAudience = jwtOptions.Audience,
            ValidateAudience = true
        };
    }

}
