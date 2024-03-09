using Microsoft.AspNetCore.SignalR;

namespace ReportingService;

public class SignalRConnectionManager<THub> : ISignalRConnectionManager<THub> where THub : Hub
{
    private readonly HashSet<string> _activeConnections = new HashSet<string>();
    private readonly IHubContext<THub> _hubContext;

    public SignalRConnectionManager(IHubContext<THub> hubContext)
    {
        _hubContext = hubContext;
    }

    public void AddConnection(string connectionId)
    {
        lock (_activeConnections)
        {
            _activeConnections.Add(connectionId);
        }
    }

    public void RemoveConnection(string connectionId)
    {
        lock (_activeConnections)
        {
            _activeConnections.Remove(connectionId);
        }
    }

    public async Task DisconnectAllConnectionsAsync()
    {
        foreach (var connectionId in _activeConnections)
        {
            await _hubContext.Clients.Client(connectionId).SendAsync("ForceDisconnect");
        }
    }
}
