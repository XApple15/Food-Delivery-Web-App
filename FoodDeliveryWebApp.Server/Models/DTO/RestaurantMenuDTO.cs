﻿namespace FoodDeliveryWebApp.Server.Models.DTO
{
    public class RestaurantMenuDTO
    {
        public Guid Id { get; set; }
        public string ProductName { get; set; }
        public string Description { get; set; }
        public double Price { get; set; }
        public string? ImageUrl { get; set; }
        public Guid RestaurantId { get; set; }
    }
}