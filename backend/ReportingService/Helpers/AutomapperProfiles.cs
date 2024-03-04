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
      CreateMap<Result, ResultSummary>()
         .ForMember(dest => dest.ResultId, opt => opt.MapFrom(src => src.Id))
         .ForMember(dest => dest.Id, opt => opt.Ignore()); 



   }
}
