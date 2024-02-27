using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;

namespace QuizService;

[Authorize]
public class QuestionController : BaseApiController
{
    private readonly IQuestionRepository _questionRepository;
    private readonly IMapper _mapper;
    private readonly ILogger<QuestionController> _logger;

    public QuestionController(IQuestionRepository questionRepository,IMapper mapper, ILogger<QuestionController> logger)
    {
        _questionRepository = questionRepository;
        _mapper = mapper;
    }
    // GET: api/Question
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Question>>> GetQuestions()
    {
        var questions = await _questionRepository.GetAllQuestionsAsync();
        return Ok(questions);
    }

    // GET: api/Question/5
    [HttpGet("{id}")]
    public async Task<ActionResult<Question>> GetQuestion(int id)
    {
        var question = await _questionRepository.GetQuestionByIdAsync(id);
        if (question == null)
        {
            return NotFound();
        }
        return Ok(question);
    }

    // POST: api/Question
    [HttpPost]
    public async Task<ActionResult<Question>> CreateQuestion([FromBody]QuestionDto questionDto)
    {
        var question = _mapper.Map<Question>(questionDto);
        await _questionRepository.CreateQuestionAsync(question);
        return CreatedAtAction(nameof(GetQuestion), new { id = question.Id }, question);
    }

    // PUT: api/Question/5
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateQuestion(int id, QuestionUpdateDto questionUpdateDto)
    {
        var question = await _questionRepository.GetQuestionByIdAsync(id);
        if(question == null) return NotFound();

        _mapper.Map(questionUpdateDto, question);
    
        await _questionRepository.UpdateQuestionAsync(question);
        return NoContent();
    }

    // DELETE: api/Question/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteQuestion(int id)
    {
        await _questionRepository.DeleteQuestionAsync(id);
        return NoContent();
    }
}
