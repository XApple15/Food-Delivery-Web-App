using FoodDeliveryWebApp.Server.Models.Domain;

namespace FoodDeliveryWebApp.Server.Repositories
{
    public interface IRestaurantRepository
    {
        Task<List<Restaurant>> GetAll(string? applicationUserId=null);
        Task<Restaurant> GetByIdAsync(Guid id);
        Task<Restaurant> Create(Restaurant restaurant);
        Task<Restaurant> Update(Guid id, Restaurant restaurant);
        Task<Restaurant> DeleteAsync(Guid id);
    }
}
