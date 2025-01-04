using FoodDeliveryWebApp.API.Models.Domain;
using FoodDeliveryWebApp.Server.Models.Domain;

namespace FoodDeliveryWebApp.Server.Models.DTO
{
    public class OrderDTO
    {
        public Guid Id { get; set; }
        public DateTime OrderDate { get; set; }
        public double Total { get; set; }
        public string Status { get; set; }
        public string Address { get; set; }

        public string UserId { get; set; }
        public Guid RestaurantId { get; set; }
        public string? CourierId { get; set; }

        public ApplicationUser UserModel { get; set; }
        public Restaurant RestaurantModel { get; set; }
        public ApplicationUser? CourierModel { get; set; }


        public List<OrderDetailsDTO> OrderDetails { get; set; }

    }
}
