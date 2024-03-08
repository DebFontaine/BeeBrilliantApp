using Microsoft.EntityFrameworkCore;

namespace ReportingService;
public class AwardsRepository : IAwardsRepository
{
    private readonly DataContext _context;

    public AwardsRepository(DataContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Awards>> GetAllAsync()
    {
        return await _context.Awards.ToListAsync();
    }

    public async Task<Awards> GetByIdAsync(int id)
    {
        return await _context.Awards.FindAsync(id);
    }
    public async Task<IEnumerable<Awards>> GetByUserIdAsync(int userId)
    {
        return await _context.Awards.Where(r => r.UserId == userId).ToListAsync();
    }

    public async Task AddAsync(Awards entity)
    {
        _context.Awards.Add(entity);
        await _context.SaveChangesAsync();
    }

    public async Task UpdateAsync(Awards entity)
    {
        _context.Entry(entity).State = EntityState.Modified;
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(int id)
    {
        var entity = await GetByIdAsync(id);
        if (entity != null)
        {
            _context.Awards.Remove(entity);
            await _context.SaveChangesAsync();
        }
    }
}
