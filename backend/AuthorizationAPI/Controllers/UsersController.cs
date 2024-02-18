using System.Collections.Generic;
using System.Security.Claims;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SQLitePCL;

namespace AuthorizationAPI;

[Authorize]
public class UsersController : BaseApiController
{
    private readonly IUserRepository _userRepository;
    private readonly IMapper _mapper;
    private readonly ILogger<UsersController> _logger;

    public UsersController(IUserRepository userRepository, IMapper mapper,
        ILogger<UsersController> logger)
    {
        _userRepository = userRepository;
        _mapper = mapper;
        _logger = logger;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<MemberDto>>> GetUsers()
    {
        var users = await _userRepository.GetUsersAsync();
        var usersToReturn = _mapper.Map<IEnumerable<MemberDto>>(users);

        return Ok(usersToReturn);
    }

    [HttpGet("id/{id}")]
    public async Task<ActionResult<MemberDto>> GetUser(int id)
    {
        var user = await _userRepository.GetuserByIdAsync(id);

        return _mapper.Map<MemberDto>(user);
    }
    [HttpGet("{username}")]
    public async Task<ActionResult<MemberDto>> GetUser(string username)
    {
        var user = await _userRepository.GetUserByUsernameAsync(username);

        return _mapper.Map<MemberDto>(user);
    }

     /* [HttpPut]
    public async Task<ActionResult> UpdateUser(MemberUpdateDto memberUpdateDto) 
    {
        var username = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var user = await _userRepository.GetUserByUsernameAsync(username);

        if(user == null) return NotFound();

        _mapper.Map(memberUpdateDto, user);

        if(await  _userRepository.SaveAllAsync()) return NoContent();

        return BadRequest($"Failed to update user");
    } */
}
