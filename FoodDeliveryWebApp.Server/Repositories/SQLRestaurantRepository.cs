using FoodDeliveryWebApp.API.Data;
using FoodDeliveryWebApp.Server.Models.Domain;
using Microsoft.EntityFrameworkCore;

namespace FoodDeliveryWebApp.Server.Repositories
{
    public class SQLRestaurantRepository : IRestaurantRepository
    {
        private readonly WarehouseDButils _db;
        
        public SQLRestaurantRepository(WarehouseDButils db)
        {
            this._db = db;
        }

        public async Task<Restaurant> Create(Restaurant restaurant)
        {
            await _db.Restaurants.AddAsync(restaurant);
            await _db.SaveChangesAsync();
            return restaurant;
        }

        public async Task<List<Restaurant>> GetAll()
        {
            return  await _db.Restaurants.ToListAsync();
        }

        public async Task<Restaurant> GetByIdAsync(Guid id)
        {
            return await _db.Restaurants.FirstOrDefaultAsync(x => x.Id == id);
        }

    

        public async Task<Restaurant> Update(Guid id, Restaurant restaurant)
        {
            var existingRestaurant = _db.Restaurants.FirstOrDefault(x => x.Id == id);
            if (existingRestaurant == null)
            {
                return null;
            }
            existingRestaurant.Name = restaurant.Name;
            existingRestaurant.Address = restaurant.Address;
            existingRestaurant.PhoneNumber = restaurant.PhoneNumber;
            existingRestaurant.Address = restaurant.Address;
            existingRestaurant.Description = restaurant.Description;
            existingRestaurant.ImageUrl = restaurant.ImageUrl;
            existingRestaurant.Rating = restaurant.Rating;
            
            await  _db.SaveChangesAsync();
            return existingRestaurant;
        }
    }
}
