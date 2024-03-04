using Microsoft.EntityFrameworkCore;

namespace ReportingService;

public abstract class AwardForCategoryAndLevelRuleBase : RuleBase
{
    protected abstract AwardType AwardType { get; }

 
    public override async Task<RuleEvaluationResult> EvaluateAsync(DataContext dbContext, ResultSummary resultSummary)
    {
        // Query for result summaries by user ID, category, and level
        var resultCount = await dbContext.ResultSummaries
            .Where(rs => rs.UserId == resultSummary.UserId && rs.Category == resultSummary.Category && rs.Level == resultSummary.Level).CountAsync();

        // Check for high score for category and level
        var earned = AwardEarned(resultCount, AwardType);

        var ruleEvaluationResult = new RuleEvaluationResult
        {
            RuleName = GetType().Name,
            Awarded = earned,
        };

        return ruleEvaluationResult;
    }
}

