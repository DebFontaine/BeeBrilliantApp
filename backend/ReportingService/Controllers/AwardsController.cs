using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ReportingService;
[Authorize]
public class AwardsController : BaseApiController
{
    private readonly IAwardsRepository _repository;

    public AwardsController(IAwardsRepository repository)
    {
        _repository = repository;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var awards = await _repository.GetAllAsync();
        return Ok(awards);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var award = await _repository.GetByIdAsync(id);
        if (award == null)
        {
            return NotFound();
        }
        return Ok(award);
    }
    [HttpGet("user/{id}")]
    public async Task<IActionResult> GetByUserId(int id)
    {
        var awards = await _repository.GetByUserIdAsync(id);
        return Ok(awards);
    }

    [HttpPost]
    public async Task<IActionResult> Add(Awards award)
    {
        await _repository.AddAsync(award);
        return CreatedAtAction(nameof(GetById), new { id = award.Id }, award);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, Awards award)
    {
        if (id != award.Id)
        {
            return BadRequest();
        }
        await _repository.UpdateAsync(award);
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        await _repository.DeleteAsync(id);
        return NoContent();
    }
}

