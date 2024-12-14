﻿namespace FoodDeliveryWebApp.Server.Models.DTO
{
    public class RestaurantDTO
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Address { get; set; }
        public string PhoneNumber { get; set; }
        public string Description { get; set; }
        public Double Rating { get; set; }
        public string? ImageUrl { get; set; }
        public string ApplicationUserId { get; set; }

    }
}