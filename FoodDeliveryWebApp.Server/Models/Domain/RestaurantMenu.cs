﻿namespace FoodDeliveryWebApp.Server.Models.Domain
{
    public class RestaurantMenu
    {
        public Guid Id { get; set; }
        public string ProductName { get; set; }
        public string Description { get; set; }
        public double Price { get; set; }
        public string? ImageUrl { get; set; }

        public Guid RestaurantId { get; set; }

        public Restaurant Restaurant { get; set; }

       
    }
}
