
namespace ReportingService;

public class ResultSummaryRepository : IResultSummaryRepository
{
    private readonly DataContext _context;

    public ResultSummaryRepository(DataContext context)
    {
        _context = context;
    }
    public async Task<ResultSummary> AddResultSummary(ResultSummary resultSummary)
    {
        await _context.ResultSummaries.AddAsync(resultSummary);
        await _context.SaveChangesAsync();
        return resultSummary; 
    }
}
