namespace QuizService;

public interface IQuizRepository
{
    Task<PagedList<Quiz>> GetAllQuizzesAsync(UserParams userParams);
    Task<Quiz> GetQuizByIdAsync(int id);
    Task<int> CreateQuizAsync(Quiz quiz);
    Task UpdateQuizAsync(Quiz quiz);
    Task<bool> DeleteQuizAsync(int id);
}
