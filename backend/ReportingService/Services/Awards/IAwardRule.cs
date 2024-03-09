namespace ReportingService;

public interface IAwardRule
{
    IQueryable<ResultSummary> GetQueryResult(DataContext dbContext, ResultSummary resultSummary);
    Task<RuleEvaluationResult> EvaluateAsync(IQueryable<ResultSummary> query, ResultSummary resultSummary);
}
