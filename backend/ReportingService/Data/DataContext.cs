using Microsoft.EntityFrameworkCore;

namespace ReportingService;

public class DataContext: DbContext
{
    public DataContext(DbContextOptions options) : base(options)
    {

    }

    public DbSet<Result> Results {get;set;}

}
