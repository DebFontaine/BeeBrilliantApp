using System.ComponentModel;
using Microsoft.EntityFrameworkCore;

namespace ReportingService;

public class HighScoreForQuizRule : RuleBase
{
    public override IQueryable<ResultSummary> GetQueryResult(DataContext dbContext, ResultSummary resultSummary)
    {
        IQueryable<ResultSummary> userQuizQuery = dbContext.ResultSummaries
            .Where(rs => rs.UserId == resultSummary.UserId && rs.QuizId == resultSummary.QuizId);
        
        return userQuizQuery;
    }
        
    public override async Task<RuleEvaluationResult> EvaluateAsync(IQueryable<ResultSummary> query, ResultSummary resultSummary)
    {
        // Check for high score for quiz
        bool isHighScore = await IsHighScore(query, resultSummary.ResultId);
        return new RuleEvaluationResult { RuleName = GetType().Name, Awarded = isHighScore };
    }
}

public class HighScoreForCategoryAndLevelRule : RuleBase
{
    public override IQueryable<ResultSummary> GetQueryResult(DataContext dbContext, ResultSummary resultSummary)
    {
       IQueryable<ResultSummary> userCategoryLevelQuery = dbContext.ResultSummaries
            .Where(rs => rs.UserId == resultSummary.UserId && rs.Category == resultSummary.Category && rs.Level == resultSummary.Level);
        
        return userCategoryLevelQuery;
    }
    public override async Task<RuleEvaluationResult> EvaluateAsync(IQueryable<ResultSummary> query, ResultSummary resultSummary)
    {
        // Check for high score for category and level
        bool isHighScore = await IsHighScore(query, resultSummary.ResultId);
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

