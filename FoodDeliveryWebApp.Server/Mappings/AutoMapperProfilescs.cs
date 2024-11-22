using AutoMapper;
using FoodDeliveryWebApp.API.Models.Domain;
using FoodDeliveryWebApp.API.Models.DTO;

namespace FoodDeliveryWebApp.API.Mappings
{
    public class AutoMapperProfilescs : Profile
    {
        public AutoMapperProfilescs()
        {
            CreateMap<ApplicationUser, UserDTO>().ReverseMap();
        }
    }
}
