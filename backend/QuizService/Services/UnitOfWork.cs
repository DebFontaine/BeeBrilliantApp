
using AutoMapper;

namespace QuizService;

public class UnitOfWork : IUnitOfWork
{
    private readonly DataContext _context;
    private readonly IMapper _mapper;

    public UnitOfWork(DataContext context, IMapper  mapper)
    {
        _context = context;
        _mapper = mapper;
    }
    public IQuestionRepository QuestionRepository => new QuestionRepository(_context, _mapper);

    public IQuizRepository QuizRepository => new QuizRepository(_context, _mapper);

    public async Task<bool> Complete()
    {
        return await _context.SaveChangesAsync() > 0;
    }

    public bool HasChanges()
    {
        return _context.ChangeTracker.HasChanges();
    }
}
