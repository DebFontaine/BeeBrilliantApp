using Microsoft.EntityFrameworkCore;
using Moq;
using ReportingService;



namespace UnitTestsReporting;
[TestFixture]
public class AwardRulesEngineTests
{
    [Test]
    [Ignore("Need to abstract dependencies in my datacontext")]
    public async Task HighScoreForQuizRule_EvaluateAsync_HighScore_ReturnsTrue()
    {
        // Arrange
        var dbContextMock = new Mock<DataContext>();
        var rule = new HighScoreForQuizRule();
        var resultSummary = new ResultSummary { UserId = 1, QuizId = 1, ResultId = 0, Score = "100%"};

        // Setup mock data
        var resultSummaries = new List<ResultSummary>
        {
            new ResultSummary { UserId = 1, QuizId = 1, ResultId = 1, Score="90%"},
            new ResultSummary { UserId = 1, QuizId = 1, ResultId = 2, Score="90%"}
        }.AsQueryable();

        var mockDbSet = new Mock<DbSet<ResultSummary>>();

        // Set it up to return your list when queried
        mockDbSet.As<IQueryable<ResultSummary>>().Setup(m => m.Provider).Returns(resultSummaries.Provider);
        mockDbSet.As<IQueryable<ResultSummary>>().Setup(m => m.Expression).Returns(resultSummaries.Expression);
        mockDbSet.As<IQueryable<ResultSummary>>().Setup(m => m.ElementType).Returns(resultSummaries.ElementType);
        mockDbSet.As<IQueryable<ResultSummary>>().Setup(m => m.GetEnumerator()).Returns(() => resultSummaries.GetEnumerator());

        var mockContext = new Mock<DataContext>();
        mockContext.Setup(c => c.ResultSummaries).Returns(mockDbSet.Object);

        var query = rule.GetQueryResult(mockContext.Object, resultSummary);
      
        // Act
        var evaluationResult = await rule.EvaluateAsync(query, resultSummary);

        // Assert
        Assert.IsTrue(evaluationResult.Awarded);
    }

   
    
}
