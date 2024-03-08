using Microsoft.EntityFrameworkCore;

namespace ReportingService;

public class ResultsRepository : IResultsRepository
{
    private readonly DataContext _context;

    public ResultsRepository(DataContext context)
    {
        _context = context;
    }

    public async Task<PagedList<Result>> GetAllResultsAsync(UserParams userParams)
    {
        var query = _context.Results.AsQueryable();

        if (!string.IsNullOrWhiteSpace(userParams.Level))
            query = query.Where(q => q.Level.ToLower() == userParams.Level.ToLower());
        if (!string.IsNullOrWhiteSpace(userParams.Category))
            query = query.Where(q => q.Category.ToLower() == userParams.Category.ToLower());

        return await PagedList<Result>.CreateAsync(
            query.AsNoTracking(), userParams.PageNumber, userParams.PageSize);
    }

    public async Task<Result> GetById(int id)
    {
        return await _context.Results.FirstOrDefaultAsync(r => r.Id == id);
    }
    public async Task<PagedList<Result>> GetByUserId(int userId, UserParams userParams)
    {
        var query = _context.Results.Where(r => r.UserId == userId).AsQueryable();
        if (!string.IsNullOrWhiteSpace(userParams.Level))
            query = query.Where(q => q.Level.ToLower() == userParams.Level.ToLower());
        if (!string.IsNullOrWhiteSpace(userParams.Category))
            query = query.Where(q => q.Category.ToLower() == userParams.Category.ToLower());

        return await PagedList<Result>.CreateAsync(
            query.AsNoTracking(), userParams.PageNumber, userParams.PageSize);
    }

    public async Task<int> AddResult(Result result)
    {
        await _context.Results.AddAsync(result);
        await _context.SaveChangesAsync();
        return result.Id; // Return the ID of the newly added quiz
    }

    public async Task Update(Result result)
    {
        _context.Entry(result).State = EntityState.Modified;
        await _context.SaveChangesAsync();
    }

    public async Task<bool> Delete(int id)
    {
        var result = await _context.Results.FindAsync(id);
        if (result != null)
        {
            _context.Results.Remove(result);
            return await _context.SaveChangesAsync() > 0;
        }
        return false;
    }

}
