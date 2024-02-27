using Newtonsoft.Json.Linq;

namespace QuizService;

public class QuestionUpdateDto
{
    public int Type {get; set;}
    public string Category {get; set;}
    public string Level {get; set;}
    public string Summary {get; set;}
    public string Title {get; set;}
    public JObject Data {get; set;}
}
