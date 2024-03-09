using AutoMapper;
using Contracts;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Moq;
using ReportingService;

namespace UnitTestsReporting;



[TestFixture]
public class ResultsControllerTests
{
    private Mock<IResultsRepository> _mockResultsRepository;
    private Mock<IResultSummaryRepository> _mockResultSummaryRepository;
    private Mock<IMapper> _mockMapper;
    private Mock<IMessageBus> _mockMessageBus;
    private Mock<IConfiguration> _mockConfiguration;
    private ResultsController _controller;

    [SetUp]
    public void Setup()
    {
        _mockResultsRepository = new Mock<IResultsRepository>();
        _mockResultSummaryRepository = new Mock<IResultSummaryRepository>();
        _mockMapper = new Mock<IMapper>();
        _mockMessageBus = new Mock<IMessageBus>();
        _mockConfiguration = new Mock<IConfiguration>();

        _controller = new ResultsController(
            _mockResultsRepository.Object,
            _mockResultSummaryRepository.Object,
            _mockMapper.Object,
            _mockMessageBus.Object,
            _mockConfiguration.Object
        );
    }

    [Test]
    public async Task GetAll_ReturnsOkResult()
    {
        // Arrange
        var userParams = new UserParams();
        var results = GetResults(3);
        var pagedResults = new PagedList<Result>(results, 3, 1, 3);
        var returnResultDtos = GetResultDtos(3);

        _mockResultsRepository.Setup(repo => repo.GetAllResultsAsync(userParams)).ReturnsAsync(pagedResults);
        _mockMapper.Setup(mapper => mapper.Map<List<ReturnResultDto>>(results)).Returns(returnResultDtos);

        // Act
        var response = await _controller.GetAll(userParams);
        var okResult = response.Result as OkObjectResult;

        // Assert
        Assert.IsNotNull(okResult);
        Assert.That(okResult.StatusCode == 200);
    }
    [Test]
    public async Task GetResultsForUser_ReturnsOkResult()
    {
        // Arrange
        UserParams userParams = new UserParams();
        var results = GetResults(3);
        var pagedResults = new PagedList<Result>(results, 3, 1, 3);
        var returnResultDtos = GetResultDtos(3);

        _mockResultsRepository.Setup(repo => repo.GetByUserId(1, userParams)).ReturnsAsync(pagedResults);
        _mockMapper.Setup(mapper => mapper.Map<List<ReturnResultDto>>(results)).Returns(returnResultDtos);
        // Act
        var response = await _controller.GetResultsForUser(1, userParams);
       var okResult = response.Result as OkObjectResult;

        // Assert
        Assert.IsNotNull(okResult);
        Assert.That(okResult.StatusCode == 200);
    }
    [Test]
    public async Task GetById_ReturnsOkResult()
    {
        // Arrange
        UserParams userParams = new UserParams();
        var result = GetResults(1).First();
 
        _mockResultsRepository.Setup(repo => repo.GetById(1)).ReturnsAsync(result);
        // Act
        var response = await _controller.GetById(1);
       var okResult = response.Result as OkObjectResult;

        // Assert
        Assert.IsNotNull(okResult);
        Assert.That(okResult.StatusCode == 200);
    }

    private List<ReturnResultDto> GetResultDtos(int quantity)
    {
        return Enumerable.Range(0, quantity)
            .Select(i => new ReturnResultDto
            {
                Id = i,
                UserId = 1,
                Username = $"user{i}",
                QuizName = $"Quiz {i}",
                QuizId = 1,
                QuizResultStr = "Passed",
                Score = "90%",
                Category = "Sample Category",
                Level = "Intermediate",
                DateTaken = DateTime.Now
            })
            .ToList();
    }
    private List<Result> GetResults(int quantity)
    {
        return Enumerable.Range(0, quantity)
            .Select(i => new Result
            {
                Id = i,
                UserId = 1,
                Username = $"user{i}",
                QuizName = $"Quiz {i}",
                QuizId = 1,
                QuizResultStr = "Passed",
                Score = "90%",
                Category = "Sample Category",
                Level = "Intermediate",
                DateTaken = DateTime.Now
            })
            .ToList();
    }


    [TearDown]
    public void TearDown()
    {
        _mockResultsRepository = null;
        _mockResultSummaryRepository = null;
        _mockMapper = null;
        _mockMessageBus = null;
        _mockConfiguration = null;
        _controller = null;
    }
}

