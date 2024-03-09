using Microsoft.Extensions.Logging;
using ReportingService;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Moq;
using NUnit.Framework;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace UnitTestsReporting;


[TestFixture]
public class AwardsUpdaterTests
{
    private AwardsUpdater _awardsUpdater;
    private Mock<DataContext> _mockDbContext;
    private Mock<ILogger<AwardsUpdater>> _mockLogger;
    private Mock<IHubContext<NotificationHub>> _mockNotificationHubContext;
    private Mock<IHubContext<AwardHub>> _mockAwardHubContext;
    private Mock<IConfiguration> _mockConfiguration;

    [SetUp]
    public void Setup()
    {
        _mockDbContext = new Mock<DataContext>();
        _mockLogger = new Mock<ILogger<AwardsUpdater>>();
        _mockNotificationHubContext = new Mock<IHubContext<NotificationHub>>();
        _mockAwardHubContext = new Mock<IHubContext<AwardHub>>();
        _mockConfiguration = new Mock<IConfiguration>();

        _awardsUpdater = new AwardsUpdater(
            _mockLogger.Object,
            _mockNotificationHubContext.Object,
            _mockAwardHubContext.Object,
            _mockConfiguration.Object
        );
    }

    [Test]
    [Ignore("Can't moq with FirstorDefaultAsync - need to refactor")]
    public async Task UpdateAwards_Should_Process_Award()
    {
        // Arrange
        var resultSummary = new ResultSummary() { Category="Category", Level="Level", DateTaken = DateTime.Today, Score = "100%", UserId = 1};
        var ruleEvaluationResults = new Dictionary<string, bool>
            {
                { "Gold", true }
            };
        Awards existingAward = default;
        _mockDbContext.Setup(db => db.Awards.FirstOrDefaultAsync(It.IsAny<Expression<Func<Awards, bool>>>(),It.IsAny<CancellationToken>()))
            .ReturnsAsync(existingAward);
        // Act
        await _awardsUpdater.UpdateAwards(_mockDbContext.Object, resultSummary, ruleEvaluationResults);

        // Assert
        _mockDbContext.Verify(db => db.Awards.Add(It.IsAny<Awards>()), Times.Once);
    }

    [Test]
    [Ignore("Can't moq with FirstorDefaultAsync - need to refactor")]
    public async Task ProcessAward_Should_Update_Existing_Award()
    {
        // Arrange
        var resultSummary = new ResultSummary();
        var ruleEvaluationResults = new Dictionary<string, bool>
            {
                { "Silver", true }
            };

        var existingAward = new Awards
        {
            UserId = resultSummary.UserId,
            Category = resultSummary.Category,
            Level = resultSummary.Level,
            Award = AwardType.Bronze
        };
        _mockDbContext.Setup(db => db.Awards.FirstOrDefaultAsync(It.IsAny<Expression<Func<Awards, bool>>>(),It.IsAny<CancellationToken>()))
            .ReturnsAsync(existingAward);

        // Act
        await _awardsUpdater.UpdateAwards(_mockDbContext.Object, resultSummary, ruleEvaluationResults);

        // Assert
        _mockDbContext.Verify(db => db.SaveChangesAsync(CancellationToken.None), Times.Once);
    }
}
