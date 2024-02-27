using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace QuizService;
[Authorize]
public class QuizController : BaseApiController
{
    private readonly IQuizRepository _quizRepository;
    private readonly IQuestionRepository _questionRepository;
    private readonly IMapper _mapper;
    private readonly ILogger<QuestionController> _logger;
    private readonly IUnitOfWork _uow;
    public QuizController(IUnitOfWork uow, IQuizRepository quizRepository, IQuestionRepository questionRepository, IMapper mapper, ILogger<QuestionController> logger)
    {
        _quizRepository = quizRepository;
        _mapper = mapper;
        _uow = uow;
    }
    // GET: api/quizzes
    [HttpGet]
    public async Task<ActionResult<PagedList<QuizDto>>> GetQuizzes([FromQuery]UserParams userParams)
    {
        var quizzes = await _uow.QuizRepository.GetAllQuizzesAsync(userParams);
        var quizDtos = _mapper.Map<List<QuizDto>>(quizzes);

        Response.AddPaginationHeader(new PaginationHeader(quizzes.CurrentPage, quizzes.PageSize, quizzes.TotalCount, quizzes.TotalPages));
        return Ok(quizDtos);
    }

    // GET: api/quizzes/{id}
    [HttpGet("{id}")]
    public async Task<ActionResult<ReturnQuizDto>> GetQuiz(int id)
    {
        var quiz = await _uow.QuizRepository.GetQuizByIdAsync(id);
        if (quiz == null)
        {
            return NotFound();
        }
        var returnQuizDto = _mapper.Map<ReturnQuizDto>(quiz);

        return Ok(returnQuizDto);
    }

    // POST: api/quizzes
    [HttpPost]
    public async Task<ActionResult<Quiz>> CreateQuiz(CreateQuizDto quizDto)
    {
        var quiz = _mapper.Map<Quiz>(quizDto);
        var newQuizId = await _uow.QuizRepository.CreateQuizAsync(quiz);

        foreach (int qId in quizDto.Questions)
        {
            var question = await _uow.QuestionRepository.GetQuestionByIdAsync(qId);
            if (question != null)
            {
                var quizQuestion = new QuizQuestion
                {
                    QuizId = newQuizId,
                    QuestionId = qId
                };

                quiz.QuizQuestions.Add(quizQuestion);
            }
        }
        await _uow.Complete(); // Save changes
        return CreatedAtAction(nameof(GetQuiz), new { id = quiz.Id }, quiz);
    }

    // PUT: api/quizzes/{id}
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateQuiz(int id, QuizUpdateDto quizUpdateDto)
    {
        var quiz = await _uow.QuizRepository.GetQuizByIdAsync(id);
        if (quiz == null) return NotFound();

        _mapper.Map(quizUpdateDto, quiz);

        var existingQuizQuestionIds = new HashSet<int>(quiz.QuizQuestions.Select(qq => qq.QuestionId));
        var questions = await _uow.QuestionRepository.GetQuestionsByIdsAsync(quizUpdateDto.Questions);

        foreach (int qId in quizUpdateDto.Questions)
        {
            if (!existingQuizQuestionIds.Contains(qId))
            {
                var question = questions.FirstOrDefault(q => q.Id == qId);
                if (question != null)
                {
                    var quizQuestion = new QuizQuestion
                    {
                        QuizId = id,
                        QuestionId = qId
                    };

                    quiz.QuizQuestions.Add(quizQuestion);
                }
            }
        }
       
        // Remove questions not in quizUpdateDto
        quiz.QuizQuestions.RemoveAll(qq => !quizUpdateDto.Questions.Contains(qq.QuestionId));

        await _uow.Complete();

        return NoContent();
    }

    // DELETE: api/quizzes/{id}
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteQuiz(int id)
    {
        var deleted = await _quizRepository.DeleteQuizAsync(id);
        if (!deleted)
        {
            return NotFound();
        }

        return NoContent();
    }
}
