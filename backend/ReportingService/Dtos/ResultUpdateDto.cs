namespace ReportingService;

public class ResultUpdateDto
{
    public int UserId { get; set; }
    public string Username { get; set; }
    public string QuizName {get; set;}
    public int  QuizId {get; set;}
    public string QuizResultStr {get; set;}
    public string Score {get; set;}
    public string Category {get; set;}
    public string Level {get; set;}
    public DateTime DateTaken {get; set;}

}
