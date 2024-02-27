namespace QuizService;

using AutoMapper;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

public class QuizRepository : IQuizRepository
{
    private readonly DataContext _context;
    private readonly IMapper _mapper;

    public QuizRepository(DataContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<PagedList<Quiz>> GetAllQuizzesAsync(UserParams userParams)
    {
        var query = _context.Quizzes.Include(q => q.QuizQuestions).AsQueryable();
        
        if(!string.IsNullOrWhiteSpace(userParams.Level))
            query = query.Where(q => q.Level.ToLower() == userParams.Level.ToLower());
        if(!string.IsNullOrWhiteSpace(userParams.Category))
            query = query.Where(q => q.Category.ToLower() == userParams.Category.ToLower());

        return await PagedList<Quiz>.CreateAsync(
            query.AsNoTracking(), userParams.PageNumber, userParams.PageSize);
    }

    public async Task<Quiz> GetQuizByIdAsync(int id)
    {
        return await _context.Quizzes
            .Include(q => q.QuizQuestions).ThenInclude(qq => qq.Question).FirstOrDefaultAsync(x => x.Id == id);
    }

    public async Task<int> CreateQuizAsync(Quiz quiz)
    {
        await _context.Quizzes.AddAsync(quiz);
        await _context.SaveChangesAsync();
        return quiz.Id; // Return the ID of the newly added quiz
    }

    public async Task UpdateQuizAsync(Quiz quiz)
    {
        _context.Entry(quiz).State = EntityState.Modified;
        await _context.SaveChangesAsync();
    }

    public async Task<bool> DeleteQuizAsync(int id)
    {
        var quizToDelete = await _context.Quizzes.FindAsync(id);
        if (quizToDelete != null)
        {
            _context.Quizzes.Remove(quizToDelete);
             return await _context.SaveChangesAsync() > 0;
        }

        return false;
    }
}

