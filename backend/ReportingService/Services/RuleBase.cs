using Microsoft.EntityFrameworkCore;

namespace ReportingService;

public abstract class RuleBase : IAwardRule
{
    protected async Task<bool> IsHighScore(IQueryable<ResultSummary> resultSummariesQuery, int resultId)
    {
        List<ResultSummary> resultSummaries = await resultSummariesQuery.ToListAsync();

        bool isHighScore = false;

        if (resultSummaries.Count > 1)
        {
            var resultSummariesOrderedByScore = resultSummaries
                .OrderByDescending(rs => ParseScore(rs.Score))
                .ToList();

            var resultSummaryWithHighestScore = resultSummariesOrderedByScore.FirstOrDefault();

            if (resultSummaryWithHighestScore != null && resultSummaryWithHighestScore.ResultId == resultId)
            {
                var previousSummaryWithHighestScore = resultSummariesOrderedByScore.Skip(1).FirstOrDefault();
                if (previousSummaryWithHighestScore != null && ParseScore(previousSummaryWithHighestScore.Score) != ParseScore(resultSummaryWithHighestScore.Score))
                    isHighScore = true;
            }
        }

        return isHighScore;
    }
    protected async Task<Tuple<int, int>> GetAwards(IQueryable<ResultSummary> resultSummariesQuery, AwardType awardLevel, int resultCount)
    {
        if (resultCount == -1)
        {
            List<ResultSummary> resultSummaries = await resultSummariesQuery.ToListAsync();
            resultSummaries = resultSummaries.Where(rs => ParseScore(rs.Score) == 100).ToList();

            resultCount = resultSummaries.Count;
            Console.WriteLine($"Result Summary Count: {resultCount}");


            if (resultCount == 0)
                return Tuple.Create(0, 0);
        }


        switch (awardLevel)
        {
            case AwardType.Gold:
                return Tuple.Create(resultCount / 30, resultCount % 30);
            case AwardType.Silver:
                return Tuple.Create(resultCount / 15, resultCount % 15);
            case AwardType.Bronze:
                return Tuple.Create(resultCount / 5 >= 1 ? 1 : 0, resultCount % 5);
        }
        return Tuple.Create(0, 0);
    }
    protected bool AwardEarned(int resultCount, AwardType awardLevel)
    {
        switch (awardLevel)
        {
            case AwardType.Gold:
                return resultCount/ 30 >= 1;
            case AwardType.Silver:
                return resultCount / 15 >= 1;
            case AwardType.Bronze:
                return resultCount / 5 >= 1;
        }
        return false;
    }

    public abstract Task<RuleEvaluationResult> EvaluateAsync(DataContext dbContext, ResultSummary resultSummary);

    private decimal ParseScore(string score)
    {
        if (score.EndsWith("%") && decimal.TryParse(score.Trim('%'), out decimal numericValue))
        {
            return numericValue;
        }

        return 0;
    }
}
