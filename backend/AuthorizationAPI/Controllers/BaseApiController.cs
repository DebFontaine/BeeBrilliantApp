//using API.Helpers;
using Microsoft.AspNetCore.Mvc;

namespace AuthorizationAPI;

//[ServiceFilter(typeof(LogUserActivity))]
[ApiController]
[Route("api/[controller]")]
public class BaseApiController : ControllerBase
{

}
