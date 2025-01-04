using FoodDeliveryWebApp.Server.Models.Domain;

namespace FoodDeliveryWebApp.Server.Repositories
{
    public interface IOrderDetailsRepository
    {
        Task<IEnumerable<OrderDetails>> GetAll(string? orderId);
        Task<OrderDetails> GetByIdAsync(Guid id);
        Task<OrderDetails> Create(OrderDetails orderDetails);
    }
}
