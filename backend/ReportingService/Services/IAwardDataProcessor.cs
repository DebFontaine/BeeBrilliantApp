namespace ReportingService;

public interface IAwardDataProcessor
{
    Task ProcessAwardDataAsync(ResultSummary resultSummary);
}
