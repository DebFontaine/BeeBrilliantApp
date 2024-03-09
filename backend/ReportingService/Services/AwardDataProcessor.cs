namespace ReportingService;

public class AwardDataProcessor : IAwardDataProcessor
{
    private readonly IServiceScopeFactory _serviceScopeFactory;

    public AwardDataProcessor(IServiceScopeFactory serviceScopeFactory)
    {
        _serviceScopeFactory = serviceScopeFactory;
    }

    public async Task ProcessAwardDataAsync(ResultSummary resultSummary)
    {
        //this new scope prob not necessary as long as AwardDataProcessor is
        //instantiated within the scope of the message processing operation
        using (var scope = _serviceScopeFactory.CreateScope())
        {
            var dbContext = scope.ServiceProvider.GetRequiredService<DataContext>();
            var awardsUpdater = scope.ServiceProvider.GetRequiredService<IAwardsUpdater>();
            var rulesEngine = scope.ServiceProvider.GetRequiredService<IAwardRulesEngine>();

            var ruleEvaluationResults = await rulesEngine.EvaluateRulesAsync(dbContext, resultSummary);           
            await awardsUpdater.UpdateAwards(dbContext, resultSummary, ruleEvaluationResults);
        }
    }
}
