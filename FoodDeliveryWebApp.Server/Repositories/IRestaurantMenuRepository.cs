using FoodDeliveryWebApp.Server.Models.Domain;

namespace FoodDeliveryWebApp.Server.Repositories
{
    public interface IRestaurantMenuRepository
    {
        Task<List<RestaurantMenu>> GetAll(string? restaurantid);
        Task<RestaurantMenu> GetByIdAsync(Guid id);
        Task<RestaurantMenu> Create(RestaurantMenu restaurantMenu);
        Task<RestaurantMenu> Update(Guid id, RestaurantMenu restaurantMenu);
    }
}
