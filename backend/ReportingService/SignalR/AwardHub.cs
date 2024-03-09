using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace ReportingService;

[Authorize]
public class AwardHub : BaseHub
{
    private readonly ISignalRConnectionManager<AwardHub> _connectionManager;

    public AwardHub(ISignalRConnectionManager<AwardHub> connectionManager, ILogger<AwardHub> logger) : base(logger)
    {
        _connectionManager = connectionManager;
    }
    public override async Task OnConnectedAsync()
    {
        LogActionMessage("Connected to");
        _connectionManager.AddConnection(Context.ConnectionId);
        await base.OnConnectedAsync();
    }
    public override async Task OnDisconnectedAsync(Exception exception)
    {
        LogActionMessage("Diconnected from");
        _connectionManager.RemoveConnection(Context.ConnectionId);
        await base.OnDisconnectedAsync(exception);
    }
    public async Task SendAwardAdded(Awards award)
    {
        var receiverId = Context.User.FindFirstValue(ClaimTypes.NameIdentifier);

        var users = new string[] { award.UserId.ToString() };

        await Clients.Users(users).SendAsync("AwardAdded", award);
    }
}
