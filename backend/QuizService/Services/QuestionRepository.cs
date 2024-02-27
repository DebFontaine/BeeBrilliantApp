using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;

namespace QuizService;

public class QuestionRepository : IQuestionRepository
{
    private readonly DataContext _dbContext;
    private readonly IMapper _mapper;

    public QuestionRepository(DataContext dbContext, IMapper mapper)
    {
        _dbContext = dbContext;
        _mapper = mapper;
    }

    public async Task<List<Question>> GetAllQuestionsAsync()
    {
        return await _dbContext.Questions.ToListAsync();
    }

    public async Task<Question> GetQuestionByIdAsync(int id)
    {
        return await _dbContext.Questions.FindAsync(id);
    }
    public async Task<List<Question>> GetQuestionsByIdsAsync(IEnumerable<int> questionIds)
    {
        return await _dbContext.Questions
            .Where(q => questionIds.Contains(q.Id))
            .ToListAsync();
    }

    public async Task<int> CreateQuestionAsync(Question question)
    {
        _dbContext.Questions.Add(question);
        await _dbContext.SaveChangesAsync();
        return question.Id;
    }

    public async Task UpdateQuestionAsync(Question question)
    {
        _dbContext.Entry(question).State = EntityState.Modified;
        await _dbContext.SaveChangesAsync();
    }

    public async Task DeleteQuestionAsync(int id)
    {
        var question = await _dbContext.Questions.FindAsync(id);
        if (question != null)
        {
            _dbContext.Questions.Remove(question);
            await _dbContext.SaveChangesAsync();
        }
    }
}
