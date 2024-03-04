using Microsoft.EntityFrameworkCore;

namespace ReportingService;

public class AwardsUpdater : IAwardsUpdater
{
    private readonly ILogger<AwardsUpdater> _logger;
    public AwardsUpdater(ILogger<AwardsUpdater> logger)
    {
        _logger = logger;
    }

    public async Task UpdateAwards(DataContext dbContext, ResultSummary resultSummary, Dictionary<string, bool> ruleEvaluationResults)
    {
        var awardRules = new Dictionary<string, AwardType>
        {
            { nameof(GoldAwardForCategoryAndLevelRule), AwardType.Gold },
            { nameof(SilverAwardForCategoryAndLevelRule), AwardType.Silver },
            { nameof(BronzeAwardForCategoryAndLevelRule), AwardType.Bronze }
        };
        var listOfValidAwardTypes = new List<AwardType>() {AwardType.Gold, AwardType.Silver, AwardType.Bronze};

        foreach (var kvp in ruleEvaluationResults)
        {
            if (kvp.Value && awardRules.TryGetValue(kvp.Key, out var awardType))
            {
                var result = await dbContext.Awards.FirstOrDefaultAsync(rs => rs.UserId == resultSummary.UserId &&
                    rs.Category == resultSummary.Category && rs.Level == resultSummary.Level &&
                    listOfValidAwardTypes.Contains(rs.Award));

                if (result != null)
                {
                    if (result.Award != awardType)
                    {
                        _logger.LogInformation($"Updating award {awardType}");
                        result.DateAwarded = DateTime.Now;
                        result.Award = awardType;
                    }
                    else
                    {
                        _logger.LogInformation($"Award type {awardType} has already been awarded to user {resultSummary.UserId}, category: {resultSummary.Category}, and level {resultSummary.Level}");
                    }
                }
                else
                {
                    _logger.LogInformation($"Adding award {awardType}");

                    dbContext.Awards.Add(new Awards
                    {
                        UserId = resultSummary.UserId,
                        Category = resultSummary.Category,
                        Level = resultSummary.Level,
                        QuizId = resultSummary.QuizId,
                        QuizName = resultSummary.QuizName,
                        DateAwarded = DateTime.Now,
                        Award = awardType,
                    });
                }
                if(dbContext.ChangeTracker.HasChanges())
                    await dbContext.SaveChangesAsync();
                break;
            }
        }
    }
    
}
