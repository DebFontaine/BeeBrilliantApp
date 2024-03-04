namespace ReportingService;

public class AverageScoreDto
{
    public int UserId { get; set; }
    public string Category {get; set;}
    public string Average {get;set;}
    public DateTime DateTaken {get; set;}
}
