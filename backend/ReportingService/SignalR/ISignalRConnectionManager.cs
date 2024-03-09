using Microsoft.AspNetCore.SignalR;

namespace ReportingService;

public interface  ISignalRConnectionManager<THub> where THub : Hub
{
    public void AddConnection(string connectionId);
    public void RemoveConnection(string connectionId);
    public Task DisconnectAllConnectionsAsync();
}
