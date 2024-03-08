namespace ReportingService;

public interface IAzureServiceBusConsumer
{
    Task Start();
    Task Stop();
}
