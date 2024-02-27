namespace QuizService;

public class Quiz
{
    public int Id { get; set; }
    public int Type { get; set; }
    public string Category {get; set;}
    public string Title {get; set;}
    public string Description {get; set;}
    public string PhotoUrl {get; set;} = "https://res.cloudinary.com/dngjhgdql/image/upload/v1708556642/quiz-default_qsuqqb.png";
    public string Level {get; set;}
    public List<QuizQuestion> QuizQuestions { get; set; } = new();
}
