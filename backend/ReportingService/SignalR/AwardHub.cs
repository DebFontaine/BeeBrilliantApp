using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace ReportingService;

[Authorize]
public class AwardHub : Hub
{
    public override Task OnConnectedAsync()
    {

        Console.WriteLine("------Connecting To Award Hub--------------");
        //var Username = Context.User.FindFirstValue(ClaimTypes.);

        var httpContextUser = Context.GetHttpContext().User;
        var userId = httpContextUser?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var Username = httpContextUser?.FindFirst(ClaimTypes.Name)?.Value;

        return base.OnConnectedAsync();
    }
    public override Task OnDisconnectedAsync(Exception? exception)
    {
        Console.WriteLine("------Disconnecting from Award Hub--------------");
        return base.OnDisconnectedAsync(exception);
    }
    public async Task SendAwardAdded(Awards award)
    {
        var receiverId = Context.User.FindFirstValue(ClaimTypes.NameIdentifier);

        var users = new string[] { award.UserId.ToString() };

        await Clients.Users(users).SendAsync("AwardAdded", award);
    }
}
