﻿using System.Text;
using AutoMapper;
using Azure.Messaging.ServiceBus;
using Microsoft.Azure.Amqp.Framing;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;

namespace ReportingService;

public class ReportDataQueueServiceBusConsumer : IAzureServiceBusConsumer
{
    private readonly string serviceBusConnectionString;
    private readonly string reportDataQueue;

    private readonly ILogger<ReportDataQueueServiceBusConsumer> _logger;
    private readonly IConfiguration _configuration;
    private readonly IServiceScopeFactory _serviceScopeFactory;
    private readonly IMapper _mapper;
    private readonly ILoggerFactory _loggerFactory;
    private ServiceBusProcessor _reportDataProcessor;


    public ReportDataQueueServiceBusConsumer(IServiceScopeFactory serviceScopeFactory, IMapper mapper, IConfiguration configuration,
            ILogger<ReportDataQueueServiceBusConsumer> logger, ILoggerFactory loggerFactory)
    {
        _serviceScopeFactory = serviceScopeFactory;
        _configuration = configuration;
        _logger = logger;
        _mapper = mapper;
        _loggerFactory = loggerFactory;

        serviceBusConnectionString = _configuration.GetValue<string>("ServiceBusConnectionString");
        reportDataQueue = _configuration.GetValue<string>("TopicAndQueueNames:ResultDataQueue");

        var client = new ServiceBusClient(serviceBusConnectionString);
        _reportDataProcessor = client.CreateProcessor(reportDataQueue);
    }

    public async Task Start()
    {
        _logger.LogInformation("AzureServiceBusConsumer started...");
        _reportDataProcessor.ProcessMessageAsync += OnResultDataReceived;
        _reportDataProcessor.ProcessErrorAsync += ErrorHandler;
        await _reportDataProcessor.StartProcessingAsync();
    }

    public async Task Stop()
    {
        _logger.LogInformation("AzureServiceBusConsumer stopped...");
        await _reportDataProcessor.StopProcessingAsync();
        await _reportDataProcessor.DisposeAsync();
    }
    private async Task OnResultDataReceived(ProcessMessageEventArgs args)
    {
        _logger.LogInformation($"Begin processing Service Bus Message {args?.Identifier}");

        try
        {
            var message = args.Message;
            var body = Encoding.UTF8.GetString(message.Body);

            ResultSummary resultSummaryObj = JsonConvert.DeserializeObject<ResultSummary>(body);
            _logger.LogInformation($"Received ResultSummary in message body: {body}");

            // Process the message - message has it's own scope within the singleton
            using (var scope = _serviceScopeFactory.CreateScope())
            {
                //data processor is registered as scoped service - new processor is created for each message scope
                var dataProcessor = scope.ServiceProvider.GetRequiredService<IAwardDataProcessor>();
                await dataProcessor.ProcessAwardDataAsync(resultSummaryObj);
            }
      
            // Complete the message after successful processing
            await args.CompleteMessageAsync(args.Message);

            _logger.LogInformation($"Completed processing for Service Bus Message {args.Identifier}");
        }
        catch (Exception ex)
        {
            _logger.LogError($"Error processing Service Bus Data {ex}");
            await args.AbandonMessageAsync(args.Message);
        }

    }

    private Task ErrorHandler(ProcessErrorEventArgs args)
    {
        _logger.LogInformation(args.Exception.ToString());
        return Task.CompletedTask;
    }
}
