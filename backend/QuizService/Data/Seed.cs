using System.Text.Json;
using System.Text.Json.Serialization;
using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;


namespace QuizService;

public class Seed
{

    public static async Task SeedQuestions(DataContext context, IMapper mapper)
    {
        if (await context.Questions.AnyAsync())
            return;
        var questionData = await File.ReadAllTextAsync("Data/QuestionSeedData.json");
        var options = new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
            DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull
        };
        //var questions = JsonSerializer.Deserialize<List<QuestionDto>>(questionData, options);
        var questions = JsonConvert.DeserializeObject<List<QuestionDto>>(questionData);
        foreach (var questionDto in questions)
        {
            var question = mapper.Map<Question>(questionDto);
            await context.Questions.AddAsync(question);
        }
        await context.SaveChangesAsync();

    }
    public static async Task SeedQuizzes(DataContext context, IMapper mapper)
    {
        if (await context.Quizzes.AnyAsync())
            return;

        var quizData = await File.ReadAllTextAsync("Data/QuizSeedData.json");
        var options = new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
            DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull
        };
        var quizzes = System.Text.Json.JsonSerializer.Deserialize<List<CreateQuizDto>>(quizData, options);
        foreach (var quizDto in quizzes)
        {
            var quiz = mapper.Map<Quiz>(quizDto);
            await context.Quizzes.AddAsync(quiz);
            await context.SaveChangesAsync();
            foreach (int qId in quizDto.Questions)
            {
                var quizQuestion = new QuizQuestion
                {
                    QuizId = quiz.Id,
                    QuestionId = qId
                };

                quiz.QuizQuestions.Add(quizQuestion);
            }
            await context.SaveChangesAsync();
        }
    }
}
