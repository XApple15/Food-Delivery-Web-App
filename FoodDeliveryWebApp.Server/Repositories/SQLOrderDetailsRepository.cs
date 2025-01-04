using FoodDeliveryWebApp.API.Data;
using FoodDeliveryWebApp.Server.Models.Domain;
using Microsoft.EntityFrameworkCore;

namespace FoodDeliveryWebApp.Server.Repositories
{
    public class SQLOrderDetailsRepository: IOrderDetailsRepository
    {
        private readonly WarehouseDButils _db;
        public SQLOrderDetailsRepository(WarehouseDButils db)
        {
            _db = db;
        }

        public async Task<OrderDetails> Create(OrderDetails orderDetails)
        {
            await _db.OrderDetails.AddAsync(orderDetails);
            await _db.SaveChangesAsync();
            return orderDetails;
        }

        public async Task<IEnumerable<OrderDetails>> GetAll(string? orderId)
        {
            return await _db.OrderDetails.Include(o=>o.RestaurantMenuModel).Where(x=> x.OrderId.ToString() == orderId).ToListAsync();
        }

        public async Task<OrderDetails> GetByIdAsync(Guid id)
        {
            return await _db.OrderDetails.Include(o => o.RestaurantMenuModel).FirstOrDefaultAsync(x => x.Id == id);
        }
    }
}
