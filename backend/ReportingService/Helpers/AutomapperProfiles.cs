using AutoMapper;
using Newtonsoft.Json.Linq;

namespace ReportingService;

public class AutomapperProfiles : Profile
{
   public AutomapperProfiles()
   {
      CreateMap<Result, ReturnResultDto>();
      CreateMap<ResultDto, Result>();
      CreateMap<ResultUpdateDto, Result>();



   }
}
