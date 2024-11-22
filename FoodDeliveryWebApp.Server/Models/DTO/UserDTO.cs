using Microsoft.AspNetCore.Identity;

namespace FoodDeliveryWebApp.API.Models.DTO
{
    public class UserDTO 
    {
        public Guid Id { get; set; }
        public string? UserName { get; set; }
        public string? Name { get; set; }
        public string? Email { get; set; }
        public string? PhoneNumber { get; set; }
        public string? Address { get; set; }
        public string? Role { get; set; }
        public string? NormalUserData { get; set; }
        public string? AdminData { get; set; }
        public string? CourierData { get; set; }
    }
}
