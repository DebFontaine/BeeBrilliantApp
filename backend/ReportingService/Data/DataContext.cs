using Microsoft.EntityFrameworkCore;

namespace ReportingService;

public class DataContext: DbContext
{
    public DataContext(DbContextOptions options) : base(options)
    {

    }

    public DbSet<Result> Results {get;set;}
    public DbSet<ResultSummary> ResultSummaries {get;set;}
    public DbSet<Awards> Awards {get;set;}
    public DbSet<AverageScore> AverageScores {get;set;}

}
