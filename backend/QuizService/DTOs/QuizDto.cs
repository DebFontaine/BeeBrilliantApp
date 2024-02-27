namespace QuizService;

public class QuizDto
{
    public int Id { get; set; }
    public int Type { get; set; }
    public string Title { get; set; }
    public string Category {get; set;}
    public string Description { get; set; }
    public string PhotoUrl { get; set; }
    public string Level { get; set; }
    public int QuestionCount { get; set; } // Include count of questions
}
public class CreateQuizDto
{
    public int Id { get; set; }
    public int Type { get; set; }
    public string Title {get; set;}
    public string Category {get; set;}
    public string Description {get; set;}
    public string PhotoUrl {get; set;}
    public string Level {get; set;}
    public List<int> Questions { get; set; }
}
public class QuizUpdateDto
{
    public int Type { get; set; }
    public string Title {get; set;}
    public string Category {get; set;}
    public string Description {get; set;}
    public string PhotoUrl {get; set;}
    public string Level {get; set;}
    public List<int> Questions { get; set; }
}
public class ReturnQuizDto
{
    public int Id { get; set; }
    public int Type { get; set; }
    public string Title {get; set;}
    public string Category {get; set;}
    public string Description {get; set;}
    public string PhotoUrl {get; set;}
    public string Level {get; set;}
    public List<ReturnQuestionDto> Questions {get; set;}
}
