namespace QuizService;

public interface IUnitOfWork
{
    IQuestionRepository QuestionRepository { get; }
    IQuizRepository QuizRepository { get; }

    Task<bool> Complete();
    bool HasChanges();

}
