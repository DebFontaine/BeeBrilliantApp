namespace ReportingService;

public class AverageScore
{
    public int Id {get; set;}
    public int UserId { get; set; }
    public string Category {get; set;}
    public string Average {get;set;}
    public DateTime DateTaken {get; set;}
}
