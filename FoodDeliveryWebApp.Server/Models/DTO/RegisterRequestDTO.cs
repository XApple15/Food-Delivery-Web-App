using System.ComponentModel.DataAnnotations;

namespace FoodDeliveryWebApp.API.Models.DTO
{
    public class RegisterRequestDTO
    {
        [Required]
        [DataType(DataType.EmailAddress)]
        public string Email { get; set; }
        [Required]
        [DataType(DataType.Password)]
        public string Password { get; set; }
        [Required]
        public string UserName { get; set; }
        [Required]
        public string PhoneNumber { get; set;}
        [Required]
        public string Address { get; set; }
        public string[] Roles { get; set; }
    }
}
