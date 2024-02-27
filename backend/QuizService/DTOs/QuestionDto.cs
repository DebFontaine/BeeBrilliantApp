using Newtonsoft.Json.Linq;

namespace QuizService;

public class QuestionDto
{
    public int Type {get; set;}
    public string Category {get; set;}
    public string Level {get; set;}
    public string Title {get; set;}
    public string Summary {get; set;}
    public JObject Data {get; set;}
}

public class ReturnQuestionDto
{
    public int Type {get; set;}
    public string Category {get; set;}
    public string Level {get; set;}
    public string Title {get; set;}
    public string Summary {get; set;}

    public QuestionDataDto Data {get; set;}
}

public abstract class QuestionDataDto
{

}

public class FillInQuestionDataDto : QuestionDataDto
{
    public string Word { get; set; }
    public string ImageData { get; set; }
    public List<LetterDto> Letters { get; set; }
}

public class LetterDto
{
    public string Letter { get; set; }
    public string UserInput { get; set; }
}

public class MultipleChoiceQuestionDto : QuestionDataDto
{
    public string ImageData { get; set; }
    public string Question { get; set; }
    public int CorrectAnswerId {get; set;}
    public List<ChoicesDto> Options {get; set;}
}
public class ChoicesDto
{
    public int Id {get; set;}
    public string Text {get; set;}

}