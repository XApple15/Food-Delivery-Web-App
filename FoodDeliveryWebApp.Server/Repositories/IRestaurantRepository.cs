using FoodDeliveryWebApp.Server.Models.Domain;

namespace FoodDeliveryWebApp.Server.Repositories
{
    public interface IRestaurantRepository
    {
        Task<List<Restaurant>> GetAll();
        Task<Restaurant> GetByIdAsync(Guid id);
        Task<Restaurant> Create(Restaurant restaurant);
        Task<Restaurant> Update(Guid id, Restaurant restaurant);
    }
}
