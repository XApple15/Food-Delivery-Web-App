using FoodDeliveryWebApp.API.Models.Domain;
using FoodDeliveryWebApp.Server.Models.Domain;

namespace FoodDeliveryWebApp.Server.Models.DTO
{
    public class AddOrderDetailsDTO
    {
        public int Quantity { get; set; }
        public decimal Price { get; set; }


        public Guid OrderId { get; set; }
        public Guid RestaurantMenuId { get; set; }

       

    }
}
