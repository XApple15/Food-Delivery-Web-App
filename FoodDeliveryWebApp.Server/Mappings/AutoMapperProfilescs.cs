﻿using AutoMapper;
using FoodDeliveryWebApp.API.Models.Domain;
using FoodDeliveryWebApp.API.Models.DTO;
using FoodDeliveryWebApp.Server.Models.Domain;
using FoodDeliveryWebApp.Server.Models.DTO;

namespace FoodDeliveryWebApp.API.Mappings
{
    public class AutoMapperProfilescs : Profile
    {
        public AutoMapperProfilescs()
        {
            CreateMap<ApplicationUser, UserDTO>().ReverseMap();
            CreateMap<Restaurant, RestaurantDTO>().ReverseMap();
            CreateMap<RestaurantMenu, RestaurantMenuDTO>().ReverseMap();
            CreateMap<RestaurantMenu, AddRestaurantMenuDTO>().ReverseMap();
            CreateMap<RestaurantDTO, AddRestaurantDTO>().ReverseMap();
            CreateMap<Restaurant, AddRestaurantDTO>().ReverseMap();
            CreateMap<Orders, OrderDTO>().ReverseMap();
            CreateMap<Orders, AddOrderDTO>().ReverseMap();
            CreateMap<OrderDTO, AddOrderDTO>().ReverseMap();
            CreateMap<OrderDetails, OrderDetailsDTO>().ReverseMap();
            CreateMap<OrderDetails, AddOrderDetailsDTO>().ReverseMap();
            CreateMap<OrderDetailsDTO, AddOrderDetailsDTO>().ReverseMap();
            CreateMap<UpdateOrderDTO, OrderDTO>().ReverseMap();
            CreateMap<UpdateOrderDTO, Orders>().ReverseMap();
        }
    }
}
