using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace ReportingService;

[Authorize]
public class NotificationHub : Hub
{
    // Define a method that clients can invoke
    public override Task OnConnectedAsync()
    {

        Console.WriteLine("------Connecting To Notification Hub--------------");
        //var Username = Context.User.FindFirstValue(ClaimTypes.);

        var httpContextUser = Context.GetHttpContext().User;
        var userId = httpContextUser?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var Username = httpContextUser?.FindFirst(ClaimTypes.Name)?.Value;
        if (!String.IsNullOrEmpty(userId))
            HubConnections.AddUserConnection(userId, Context.ConnectionId);

        return base.OnConnectedAsync();
    }
    public override Task OnDisconnectedAsync(Exception? exception)
    {
        Console.WriteLine("------Disconnecting from Notification Hub--------------");
        var UserId = Context.User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (HubConnections.HasUserConnection(UserId, Context.ConnectionId))
        {
            var UserConnections = HubConnections.Users[UserId];
            UserConnections.Remove(Context.ConnectionId);

            HubConnections.Users.Remove(UserId);
            if (UserConnections.Any())
                HubConnections.Users.Add(UserId, UserConnections);
        }

        return base.OnDisconnectedAsync(exception);
    }
    public async Task SendMessage(string userId)
    {
        var receiverId = Context.User.FindFirstValue(ClaimTypes.NameIdentifier);
      
        var users = new string[] { userId };

        await Clients.Users(users).SendAsync("ReceivePrivateMessage", "hello");
    }
}
