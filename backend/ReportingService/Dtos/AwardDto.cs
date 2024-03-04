namespace ReportingService;

public class AwardDto
{
    public int UserId { get; set; }
    public int QuizId {get; set; } 
    public string QuizName {get; set;}
    public string Category {get; set;}
    public int  Level {get; set;}
    public DateTime DateAwarded {get; set;}
    public AwardType Award {get; set;}
}
