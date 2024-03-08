namespace ReportingService;

public interface IResultSummaryRepository
{
    Task <ResultSummary> AddResultSummary(ResultSummary resultSummaryDTO);

}
