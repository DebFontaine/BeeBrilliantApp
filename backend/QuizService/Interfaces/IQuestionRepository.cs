namespace QuizService;

public interface IQuestionRepository
{
    public Task<List<Question>> GetAllQuestionsAsync();
    public Task<Question> GetQuestionByIdAsync(int id);
    Task<List<Question>> GetQuestionsByIdsAsync(IEnumerable<int> questionIds);
    public Task<int> CreateQuestionAsync(Question question);
    public Task UpdateQuestionAsync(Question question);
    public Task DeleteQuestionAsync(int id);

}
