namespace ReportingService;

public class AwardRulesEngine
{
    private readonly List<IAwardRule> _rules;
    private readonly ILogger<AwardRulesEngine> _logger;

    public AwardRulesEngine(ILogger<AwardRulesEngine> logger)
    {
        _logger = logger;
        _rules = new List<IAwardRule>();
        // Add rules to the rules engine
        _rules.Add(new HighScoreForQuizRule());
        _rules.Add(new HighScoreForCategoryAndLevelRule());
        _rules.Add(new GoldAwardForCategoryAndLevelRule());
        _rules.Add(new SilverAwardForCategoryAndLevelRule());
        _rules.Add(new BronzeAwardForCategoryAndLevelRule());
    }

    /// <summary>
    /// Evaluates all the rules in the rule set to create a dictionary of award types and a bool indicating if the
    /// award was earned with this result. If the user earns a gold for this result then we skip processing of the Silver
    /// and Bronze rules as only one award per category\level is allowed. Same logic applies if they earn a silver
    /// </summary>
    /// <param name="dbContext">The entity framework databse context</param>
    /// <param name="resultSummary">Result Summary entity to process</param>
    /// <returns></returns>
    public async Task<Dictionary<string, bool>> EvaluateRulesAsync(DataContext dbContext, ResultSummary resultSummary)
    {
        _logger.LogInformation($"Evaluating rules for User:{resultSummary.UserId}, Category: {resultSummary.Category}, Level: {resultSummary.Level}");
        var ruleEvaluationResults = new Dictionary<string, bool>();

        foreach (var rule in _rules)
        {
            try
            {
                var evaluationResult = await rule.EvaluateAsync(dbContext, resultSummary);
                _logger.LogInformation($"Rule result {evaluationResult.RuleName}: {evaluationResult.Awarded}");
                ruleEvaluationResults.Add(evaluationResult.RuleName, evaluationResult.Awarded);
          
                if ((evaluationResult.RuleName == nameof(GoldAwardForCategoryAndLevelRule) || evaluationResult.RuleName == nameof(SilverAwardForCategoryAndLevelRule)) && evaluationResult.Awarded == true)
                    break;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error evaluating rule {rule.GetType().Name}: {ex.Message}");
            }
        }

        return ruleEvaluationResults;
    }
}
