namespace ReportingService;

public interface IAwardsRepository
{
    Task<IEnumerable<Awards>> GetAllAsync();
    Task<Awards> GetByIdAsync(int id);
    Task<IEnumerable<Awards>> GetByUserIdAsync(int userId);
    Task AddAsync(Awards award);
    Task UpdateAsync(Awards award);
    Task DeleteAsync(int id);
}
