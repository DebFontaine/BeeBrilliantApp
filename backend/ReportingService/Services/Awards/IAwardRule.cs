namespace ReportingService;

public interface IAwardRule
{
    Task<RuleEvaluationResult> EvaluateAsync(DataContext dbContext, ResultSummary resultSummary);
}
