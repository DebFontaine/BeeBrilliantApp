using Microsoft.Extensions.Azure;

namespace ReportingService;

public enum AwardType
{
    HighScoreQuiz = 1,
    HighScoreLevelCategory = 2,
    Bronze = 3,
    Silver = 4,
    Gold = 5
}
public class Awards
{
    public int Id {get; set;}
    public int UserId { get; set; }
    public int QuizId {get; set; } 
    public string QuizName {get; set;}
    public string Category {get; set;}
    public string  Level {get; set;}
    public DateTime DateAwarded {get; set;}
    public AwardType Award {get; set;}
}
