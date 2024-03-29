using Contracts;
using Microsoft.EntityFrameworkCore;
using ReportingService;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddDbContext<DataContext>(opt =>
{
    opt.UseMySQL(builder.Configuration.GetConnectionString("DefaultConnection"));

});

builder.Services.AddCors();
builder.Services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());
builder.Services.AddScoped<IResultsRepository, ResultsRepository>();
builder.Services.AddScoped<IAwardsRepository, AwardsRepository>();
builder.Services.AddScoped<IResultSummaryRepository, ResultSummaryRepository>();
builder.Services.AddScoped<IMessageBus, MessageBus>();
builder.Services.AddScoped<IAwardsUpdater, AwardsUpdater>();
builder.Services.AddScoped<IAwardDataProcessor, AwardDataProcessor>();
builder.Services.AddScoped<IAwardRulesEngine, AwardRulesEngine>();
builder.Services.AddSingleton<IAzureServiceBusConsumer, ReportDataQueueServiceBusConsumer>();
if(builder.Environment.IsProduction())
{
    var connectionAzureSignalR = builder.Configuration["AzureSignalRConnection"];

    builder.Services.AddSignalR().AddAzureSignalR(connectionAzureSignalR);
}
else
{
    builder.Services.AddSignalR(); 
}
builder.Services.AddSingleton<ISignalRConnectionManager<NotificationHub>,SignalRConnectionManager<NotificationHub>>();
builder.Services.AddSingleton<ISignalRConnectionManager<AwardHub>,SignalRConnectionManager<AwardHub>>();


builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddAppAuthetication(builder.Configuration);
builder.Services.AddAuthorization();

builder.Services.AddHostedService<SummarizationService>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
app.UseCors(builder => builder.AllowAnyHeader().AllowAnyMethod().AllowCredentials().
    WithOrigins("https://localhost:4200","http://localhost:4200","https://beebrilliant.azurewebsites.net"));

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();
app.MapHub<NotificationHub>("hubs/notification");
app.MapHub<AwardHub>("hubs/awards");
app.UseSignalRconnectionManager();



using var scope = app.Services.CreateScope();
var services = scope.ServiceProvider;


try
{
    var context = services.GetRequiredService<DataContext>();
    await context.Database.MigrateAsync();
}
catch (Exception ex)
{
    var logger = services.GetService<ILogger<Program>>();
    logger.LogError(ex, "An error occurred during migration");
}

app.Run();
