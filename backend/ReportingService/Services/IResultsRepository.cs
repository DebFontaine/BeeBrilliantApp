namespace ReportingService;

public interface IResultsRepository
{
    public Task<PagedList<Result>> GetAllResultsAsync(UserParams userParams);
    public Task<Result> GetById(int id);
    public Task<PagedList<Result>> GetByUserId(int userId, UserParams userParams);
    public Task<int> AddResult(Result result);
    public Task Update(Result result);
    public Task<bool>Delete(int id);
}
