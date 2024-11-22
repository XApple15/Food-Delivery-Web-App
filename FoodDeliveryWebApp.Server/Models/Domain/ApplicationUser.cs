using FoodDeliveryWebApp.Server.Enums;
using FoodDeliveryWebApp.Server.Models.Domain;
using Microsoft.AspNetCore.Identity;

namespace FoodDeliveryWebApp.API.Models.Domain
{
    public class ApplicationUser : IdentityUser
    {
        public string? Name { get; set; }   
        public string? Address { get; set; }
        public string? NormalUserData { get; set; }
        public string? AdminData { get; set; }
        public string? CourierData { get; set; }

    }
}
