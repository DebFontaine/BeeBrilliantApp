using Microsoft.Extensions.Hosting.Internal;

namespace ReportingService;


public static class ApplicationBuilderExtensions
{
    public static IApplicationBuilder UseSignalRconnectionManager(this IApplicationBuilder app)
    {
        var appLifeTime = app.ApplicationServices.GetService<IHostApplicationLifetime>();

        appLifeTime.ApplicationStopping.Register(() =>
        {
            var connectionManager = app.ApplicationServices.GetService<SignalRConnectionManager<NotificationHub>>();
            if(connectionManager != null)
                connectionManager.DisconnectAllConnectionsAsync().Wait(); 
        });

        return app;
    }
}


