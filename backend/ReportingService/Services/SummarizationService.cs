
namespace ReportingService;

public class SummarizationService : BackgroundService
{
    private readonly ILogger<SummarizationService> _logger;
    private readonly IServiceProvider _services;

    private readonly IAzureServiceBusConsumer _serviceBusConsumer;
    public SummarizationService(IAzureServiceBusConsumer serviceBusConsumer, IServiceScopeFactory serviceScopeFactory,
        ILogger<SummarizationService> logger, IServiceProvider services)
    {
        _logger = logger;
        _services = services;
        _serviceBusConsumer = serviceBusConsumer;

    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        _logger.LogInformation("Starting reporting summarization");
        try
        {
            
            await _serviceBusConsumer.Start();

            stoppingToken.Register(() => _logger.LogInformation("Summarization Service is stopping"));
            while (!stoppingToken.IsCancellationRequested)
            {
                await Task.Delay(1000, stoppingToken);
            }
        }
        finally
        {
            await _serviceBusConsumer.Stop();
        }
    }
}
