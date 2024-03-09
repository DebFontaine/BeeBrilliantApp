using System.Security.Claims;
using Microsoft.AspNetCore.SignalR;

namespace ReportingService;

public abstract class BaseHub : Hub
{
    private readonly ILogger<BaseHub> _logger;

    protected BaseHub(ILogger<BaseHub> logger)
    {
        _logger = logger;
    }

    protected void LogActionMessage(string action)
    {
        var userId = Context.User.FindFirstValue(ClaimTypes.NameIdentifier);
        var httpContextUser = Context.GetHttpContext().User;
        var username = httpContextUser?.FindFirst(ClaimTypes.Name)?.Value;
        _logger.LogInformation($"--- {username} with UserId {userId} {action} {GetType().Name} ---");
    }
}
