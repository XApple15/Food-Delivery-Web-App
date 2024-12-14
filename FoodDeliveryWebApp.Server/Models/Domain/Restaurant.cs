using FoodDeliveryWebApp.API.Models.Domain;

namespace FoodDeliveryWebApp.Server.Models.Domain
{
    public class Restaurant
    {
        public Guid Id { get; set; }
        public string ApplicationUserId { get; set; }
        public string Name { get; set; }
        public string Address { get; set; }
        public string PhoneNumber { get; set; }
        public string Description { get; set; }
        public string Rating { get; set; }
        public string? ImageUrl { get; set; }

        public ApplicationUser ApplicationUserModel { get; set; }
    }
}
