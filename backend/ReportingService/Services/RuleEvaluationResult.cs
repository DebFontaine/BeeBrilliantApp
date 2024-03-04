namespace ReportingService;

public class RuleEvaluationResult
{
    public string RuleName { get; set; }
    public bool Awarded { get; set; }
    public bool IsHighScore { get; set; }
    public bool GoldAward { get; set;}
    public bool SilverAward { get; set;}
    public bool BronzeAward { get; set;}

}
