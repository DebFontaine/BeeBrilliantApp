using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

namespace ReportingService;

public class AwardsUpdater : IAwardsUpdater
{
    private readonly ILogger<AwardsUpdater> _logger;
    private readonly IHubContext<NotificationHub> _notificationHubContext;
    private readonly IHubContext<AwardHub> _awardHubContext;

    private readonly IConfiguration _configuration;

    private readonly Dictionary<string, AwardType> _awardRules = new Dictionary<string, AwardType>
    {
        { nameof(GoldAwardForCategoryAndLevelRule), AwardType.Gold },
        { nameof(SilverAwardForCategoryAndLevelRule), AwardType.Silver },
        { nameof(BronzeAwardForCategoryAndLevelRule), AwardType.Bronze }
    };


    public AwardsUpdater(ILogger<AwardsUpdater> logger, IHubContext<NotificationHub> notificationHubContext,
        IHubContext<AwardHub> awardHubContext, IConfiguration configuration)
    {
        _logger = logger;
        _notificationHubContext = notificationHubContext;
        _awardHubContext = awardHubContext;
        _configuration = configuration;

    }
    public async Task UpdateAwards(DataContext dbContext, ResultSummary resultSummary, Dictionary<string, bool> ruleEvaluationResults)
    {
#if DEBUG
        await SendTestAwardAndMessage(resultSummary);
#endif


        foreach (var kvp in ruleEvaluationResults)
        {
            if (kvp.Value && _awardRules.TryGetValue(kvp.Key, out var awardType))
            {
                await ProcessAward(dbContext, resultSummary, awardType);
                break;
            }
        }
    }

    private async Task ProcessAward(DataContext dbContext, ResultSummary resultSummary, AwardType awardType)
    {
        try
        {
            var existingAward = await dbContext.Awards.FirstOrDefaultAsync(rs => rs.UserId == resultSummary.UserId &&
                      rs.Category == resultSummary.Category && rs.Level == resultSummary.Level);

            if (existingAward != null)
                await UpdateExistingAward(resultSummary, awardType, existingAward);

            else
                await AddNewAward(dbContext, resultSummary, awardType);


            if (dbContext.ChangeTracker.HasChanges())
                await dbContext.SaveChangesAsync();
        }
        catch (Exception ex)
        {
            _logger.LogError($"Error processing award: {ex}");
            throw;
        }

    }

    private async Task AddNewAward(DataContext dbContext, ResultSummary resultSummary, AwardType awardType)
    {
        _logger.LogInformation($"Adding award {awardType}");

        var newAward = new Awards
        {
            UserId = resultSummary.UserId,
            Category = resultSummary.Category,
            Level = resultSummary.Level,
            QuizId = resultSummary.QuizId,
            QuizName = resultSummary.QuizName,
            DateAwarded = DateTime.Now,
            Award = awardType
        };

        dbContext.Awards.Add(newAward);
        await SendAwardAndAwardNotification(resultSummary.UserId.ToString(), "AwardUpdated", awardType.ToString(), newAward);
    }

    private async Task UpdateExistingAward(ResultSummary resultSummary, AwardType awardType, Awards existingAward)
    {
        if (existingAward.Award < awardType)
        {
            _logger.LogInformation($"Updating award {awardType}");
            existingAward.DateAwarded = DateTime.Now;
            existingAward.Award = awardType;       
            await SendAwardAndAwardNotification(resultSummary.UserId.ToString(), "AwardUpdated", awardType.ToString(), existingAward);
        }
        else
        {
            _logger.LogInformation($"Award type {awardType} has already been awarded to user {resultSummary.UserId}, category: {resultSummary.Category}, and level {resultSummary.Level}");
        }
    }

    private async Task SendAwardAndAwardNotification(string userId, string awardEvent, string awardType, Awards award)
    {
        await Task.WhenAll(
            _notificationHubContext.Clients.User(userId).SendAsync("ReceiveAwardNotification", awardType),
            _awardHubContext.Clients.User(userId).SendAsync(awardEvent, award)
        );
    }

#if DEBUG
    private async Task SendTestAwardAndMessage(ResultSummary resultSummary)
    {
        _logger.LogInformation("---- SENDING TEST MESSAGE AND AWARD --");
        if(_configuration.GetValue<bool>("TestSignalR"))
        {
            var newAward = new Awards
            {
                UserId = resultSummary.UserId,
                Category = resultSummary.Category,
                Level = resultSummary.Level,
                QuizId = resultSummary.QuizId,
                QuizName = resultSummary.QuizName,
                DateAwarded = DateTime.Now,
                Award = AwardType.Gold
            };

            await SendAwardAndAwardNotification(resultSummary.UserId.ToString(), "AwardAdded", "test", newAward);
        }       
    }   
#endif


}
