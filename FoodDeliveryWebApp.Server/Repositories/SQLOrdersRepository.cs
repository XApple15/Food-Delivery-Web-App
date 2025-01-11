using FoodDeliveryWebApp.API.Data;
using FoodDeliveryWebApp.API.Models.Domain;
using FoodDeliveryWebApp.Server.Models.DTO;
using Microsoft.EntityFrameworkCore;

namespace FoodDeliveryWebApp.Server.Repositories
{
    public class SQLOrdersRepository : IOrdersRepository
    {
        private readonly WarehouseDButils _db;
        public SQLOrdersRepository(WarehouseDButils db)
        {
            this._db = db;
        }
        public async Task<Orders> Create(Orders order)
        {
            await _db.Orders.AddAsync(order);
            await _db.SaveChangesAsync();
            return order;
        }

        public async Task DeleteOrder(Guid id)
        {
           
            throw new NotImplementedException();
        }

        public async Task<IEnumerable<Orders>> GetAll(string? applicationUserId, string? restaurantId,string? courierId)
        {
            var query = _db.Orders.AsQueryable();
            if (!string.IsNullOrWhiteSpace(applicationUserId))
            {
                query = query.Where(x => x.UserId == applicationUserId);
            }
            if(!string.IsNullOrWhiteSpace(restaurantId))
            {
                query = query.Where(x => x.RestaurantId.ToString() == restaurantId);
            }
            if (!string.IsNullOrWhiteSpace(courierId))
            {
                query = query.Where(x => x.CourierId.ToString() == courierId);

            }
            query = query.Include(o => o.RestaurantModel)
                .Include(o => o.OrderDetails)
                   .ThenInclude(od => od.RestaurantMenuModel);

            return await query.ToListAsync();
        }

        public async Task<Orders> GetByIdAsync(Guid id)
        {
            return await _db.Orders .Include(o => o.RestaurantModel)
                                    .Include(o => o.OrderDetails)
                                        .ThenInclude(od => od.RestaurantMenuModel)
                                    .FirstOrDefaultAsync(x => x.Id == id);
        }

        public async Task<Orders> UpdateOrder(Guid id, UpdateOrderDTO order)
        {
            var existingOrder = _db.Orders.FirstOrDefault(x => x.Id == id);
            if (existingOrder == null)
            {
                return null;
            }
            if(order.Status != null)
            {
                existingOrder.Status = order.Status;
            }
            if (order.CourierId != null)
            {
                existingOrder.CourierId = order.CourierId;
            }
            await _db.SaveChangesAsync();
            return existingOrder;
        }
    }
}
