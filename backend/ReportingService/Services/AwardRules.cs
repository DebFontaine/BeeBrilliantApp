using System.ComponentModel;
using Microsoft.EntityFrameworkCore;

namespace ReportingService;

public class HighScoreForQuizRule : RuleBase
{
    public override async Task<RuleEvaluationResult> EvaluateAsync(DataContext dbContext, ResultSummary resultSummary)
    {
        // Query for result summaries by user ID and quiz ID
        IQueryable<ResultSummary> userQuizQuery = dbContext.ResultSummaries
            .Where(rs => rs.UserId == resultSummary.UserId && rs.QuizId == resultSummary.QuizId);

        // Check for high score for quiz
        bool isHighScore = await IsHighScore(userQuizQuery, resultSummary.ResultId);
        return new RuleEvaluationResult { RuleName = GetType().Name, Awarded = isHighScore };
    }
}

public class HighScoreForCategoryAndLevelRule : RuleBase
{
    public override async Task<RuleEvaluationResult> EvaluateAsync(DataContext dbContext, ResultSummary resultSummary)
    {
        // Query for result summaries by user ID, category, and level
        IQueryable<ResultSummary> userCategoryLevelQuery = dbContext.ResultSummaries
            .Where(rs => rs.UserId == resultSummary.UserId && rs.Category == resultSummary.Category && rs.Level == resultSummary.Level);

        // Check for high score for category and level
        bool isHighScore = await IsHighScore(userCategoryLevelQuery, resultSummary.ResultId);
        return new RuleEvaluationResult { RuleName = GetType().Name, Awarded = isHighScore };
    }
}

public class GoldAwardForCategoryAndLevelRule : AwardForCategoryAndLevelRuleBase
{
    protected override AwardType AwardType => AwardType.Gold;
}
public class SilverAwardForCategoryAndLevelRule : AwardForCategoryAndLevelRuleBase
{
    protected override AwardType AwardType => AwardType.Silver;
}
public class BronzeAwardForCategoryAndLevelRule : AwardForCategoryAndLevelRuleBase
{
    protected override AwardType AwardType => AwardType.Bronze;
}

