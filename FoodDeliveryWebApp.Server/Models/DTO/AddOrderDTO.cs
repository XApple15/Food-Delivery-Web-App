namespace FoodDeliveryWebApp.Server.Models.DTO
{
    public class AddOrderDTO
    {
        public double Total { get; set; }
        public string Address { get; set; }

        public string UserId { get; set; }
        public Guid RestaurantId { get; set; }
    }
}
