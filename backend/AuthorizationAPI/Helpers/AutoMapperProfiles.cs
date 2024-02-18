using AutoMapper;
namespace AuthorizationAPI;


public class AutoMapperProfiles : Profile
{
     public AutoMapperProfiles()
     {
        CreateMap<AppUser, MemberDto>();
        CreateMap<MemberUpdateDto, AppUser>();
        CreateMap<RegisterDto, AppUser>();

     }

}
