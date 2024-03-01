using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ReportingService;
[Authorize]
public class ResultsController : BaseApiController
{
    private readonly IResultsRepository _resultsRepository;
    private readonly IMapper _mapper;

    public ResultsController(IResultsRepository repository, IMapper mapper)
    {
        _resultsRepository = repository;
        _mapper = mapper;
    }

    [HttpGet]
    public async Task<ActionResult<PagedList<ReturnResultDto>>> GetAll([FromQuery]UserParams userParams)
    {
        var results = await _resultsRepository.GetAllResultsAsync(userParams);
        var returnResultDtos = _mapper.Map<List<ReturnResultDto>>(results);

        Response.AddPaginationHeader(new PaginationHeader(results.CurrentPage, results.PageSize, results.TotalCount, results.TotalPages));
        return Ok(returnResultDtos);
    }
    [HttpGet("user/{id}")]
    public async Task<ActionResult<PagedList<ReturnResultDto>>> GetResultsForUser(int id,[FromQuery]UserParams userParams)
    {
        var results = await _resultsRepository.GetByUserId(id,userParams);
        var returnResultDtos = _mapper.Map<List<ReturnResultDto>>(results);

        Response.AddPaginationHeader(new PaginationHeader(results.CurrentPage, results.PageSize, results.TotalCount, results.TotalPages));
        return Ok(returnResultDtos);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ReturnResultDto>> GetById(int id)
    {
        var result = await _resultsRepository.GetById(id);
        if (result == null)
        {
            return NotFound();
        }
        var returnResultDto = _mapper.Map<ReturnResultDto>(result);
        return Ok(result);
    }

    [HttpPost]
    public async Task<ActionResult<Result>> AddResult(ResultDto resultDto)
    {
        var result = _mapper.Map<Result>(resultDto);
        await _resultsRepository.AddResult(result);
        return CreatedAtAction(nameof(AddResult), new { id = result.Id }, result);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, ResultUpdateDto resultUpdateDto)
    {
        var result = await _resultsRepository.GetById(id);
        if (result == null) return NotFound();

        _mapper.Map(resultUpdateDto, result);
        await _resultsRepository.Update(result);
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        await _resultsRepository.Delete(id);
        return NoContent();
    }
}
