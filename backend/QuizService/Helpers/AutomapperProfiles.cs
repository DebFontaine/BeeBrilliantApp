using AutoMapper;
using Newtonsoft.Json.Linq;

namespace QuizService;

public class AutomapperProfiles : Profile
{
   public AutomapperProfiles()
   {
      CreateMap<QuestionDto, Question>();
      CreateMap<QuestionUpdateDto, Question>();
      CreateMap<CreateQuizDto, Quiz>();

      CreateMap<Quiz, ReturnQuizDto>()
            .ForMember(dest => dest.Description, opt => opt.MapFrom(src => src.Description))
            .ForMember(dest => dest.Questions, opt => opt.MapFrom(src => src.QuizQuestions.Select(qq => qq.Question)));

      CreateMap<Question, ReturnQuestionDto>()
            .ForMember(dest => dest.Data, opt => opt.MapFrom(src => MapQuestionData(src.Type,src.Data)));

      CreateMap<Quiz, QuizDto>()
            .ForMember(dest => dest.QuestionCount, opt => opt.MapFrom(src => src.QuizQuestions.Count));
      
      CreateMap<QuizUpdateDto, Quiz>();


   }
    private static QuestionDataDto MapQuestionData(int questionType, JObject data)
    {
        switch(questionType)
        {
            case 1:
                  return data.ToObject<FillInQuestionDataDto>();
            case 2:
                  return data.ToObject<MultipleChoiceQuestionDto>();
        }
        /* if (data.ContainsKey("word") && data.ContainsKey("imageData") && data.ContainsKey("letters"))
        {
            return data.ToObject<FillInQuestionDataDto>();
        } */
        return null;
    }

}
