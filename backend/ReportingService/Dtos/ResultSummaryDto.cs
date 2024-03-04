namespace ReportingService;

public class ResultSummaryDto
{
    public int UserId { get; set; }
    public int QuizId {get; set;}
    public int ResultId {get; set;}
    public string QuizName {get; set;}
    public string Score {get; set;}
    public string Category {get; set;}
    public string Level {get; set;}
    public DateTime DateTaken {get; set;}
}
