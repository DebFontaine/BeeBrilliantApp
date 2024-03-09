namespace ReportingService;

public interface IAwardRulesEngine
{
    Task<Dictionary<string, bool>> EvaluateRulesAsync(DataContext dbContext, ResultSummary resultSummary);
}
