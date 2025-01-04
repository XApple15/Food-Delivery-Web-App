using FoodDeliveryWebApp.API.Models.Domain;
using FoodDeliveryWebApp.Server.Models.DTO;

namespace FoodDeliveryWebApp.Server.Repositories
{
    public interface IOrdersRepository
    {
        Task<IEnumerable<Orders>> GetAll(string? applicationUserId,string? restaurantId);
        Task<Orders> GetByIdAsync(Guid id);
        Task<Orders> Create(Orders order);
        Task<Orders> UpdateOrder(Guid id, UpdateOrderDTO order);
        Task DeleteOrder(Guid id);
    }
}
