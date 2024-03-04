namespace Contracts;

public interface IMessageBus
{
    Task PublishMessage(object message, string queueName);
}
