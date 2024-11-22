using System.ComponentModel.DataAnnotations;

namespace FoodDeliveryWebApp.API.Models.DTO
{
    public class AddClientDTO
    {
        [Required]
        [MinLength(1)]
        public string Name { get; set; }
        [Required]
        // must contain @ and .
        public string Email { get; set; }
        [Required]
        //only digits
        [MinLength(8)]
        public string PhoneNumber { get; set; }
        [Required]
        [MinLength(3)]
        public string Address { get; set; }
       

    }
}
