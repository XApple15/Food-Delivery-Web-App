namespace FoodDeliveryWebApp.Server.Models.DTO
{
    public class AddRestaurantDTO
    {
        public string Name { get; set; }
        public string Address { get; set; }
        public string PhoneNumber { get; set; }
        public string Description { get; set; }
        public string Rating { get; set; }
        public string ImageUrl { get; set; }
        public string ApplicationUserId { get; set; }
    }
}
