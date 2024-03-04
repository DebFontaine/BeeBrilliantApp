namespace ReportingService;

public interface IAwardsUpdater
{
    Task UpdateAwards(DataContext dbContext, ResultSummary resultSummary, Dictionary<string, bool> ruleEvaluationResults);
}
