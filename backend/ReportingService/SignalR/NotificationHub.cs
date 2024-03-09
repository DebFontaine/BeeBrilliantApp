using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace ReportingService;

[Authorize]
public class NotificationHub : BaseHub
{
    private readonly ISignalRConnectionManager<NotificationHub> _connectionManager;

    public NotificationHub(ISignalRConnectionManager<NotificationHub> connectionManager, ILogger<NotificationHub> logger) : base(logger)
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
}
