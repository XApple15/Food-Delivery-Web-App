using FoodDeliveryWebApp.API.Data;
using FoodDeliveryWebApp.Server.Models.Domain;
using Microsoft.EntityFrameworkCore;

namespace FoodDeliveryWebApp.Server.Repositories
{
    public class SQLRestaurantMenuRepository : IRestaurantMenuRepository
    {
        private readonly WarehouseDButils _db;


        public SQLRestaurantMenuRepository(WarehouseDButils db)
        {
            this._db = db;
        }

        public async Task<RestaurantMenu> Create(RestaurantMenu restaurantMenu)
        {
            await _db.RestaurantMenus.AddAsync(restaurantMenu);
            await _db.SaveChangesAsync();
            return restaurantMenu;
        }

        public async Task<List<RestaurantMenu>> GetAll(string? restaurantid)
        {
            if (!string.IsNullOrWhiteSpace(restaurantid))
            {
                Guid restaurantGuid;
                if (Guid.TryParse(restaurantid, out restaurantGuid))
                {
                    return await _db.RestaurantMenus
                                    .Where(x => x.RestaurantId == restaurantGuid)
                                    .ToListAsync();
                }
                else
                {
                    throw new ArgumentException("Invalid restaurant ID format.");
                }
            }
            return await _db.RestaurantMenus.ToListAsync();
        }


        public async Task<RestaurantMenu> GetByIdAsync(Guid id)
        {
            return await _db.RestaurantMenus.FirstOrDefaultAsync(x => x.Id == id);
        }

        public async Task<RestaurantMenu> Update(Guid id, RestaurantMenu restaurantMenu)
        {
            var existingRestaurantMenu = _db.RestaurantMenus.FirstOrDefault(x => x.Id == id);
            if (existingRestaurantMenu == null)
            {
                return null;
            }
            existingRestaurantMenu.ProductName = restaurantMenu.ProductName;
            existingRestaurantMenu.Description = restaurantMenu.Description;
            existingRestaurantMenu.Price = restaurantMenu.Price;
            existingRestaurantMenu.ImageUrl = restaurantMenu.ImageUrl;
            existingRestaurantMenu.RestaurantId = restaurantMenu.RestaurantId;


            await _db.SaveChangesAsync();
            return existingRestaurantMenu;
        }
    }
}
