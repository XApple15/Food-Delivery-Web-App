﻿using FoodDeliveryWebApp.API.Models.Domain;
using System.Text.Json.Serialization;

namespace FoodDeliveryWebApp.Server.Models.Domain
{
    public class OrderDetails
    {
        public Guid Id { get; set; }
        public int Quantity { get; set; }
        public decimal Price { get; set; }


        public Guid OrderId { get; set; }
        public Guid RestaurantMenuId { get; set; }


        [JsonIgnore]
        public Orders OrderModel { get; set; }
        [JsonIgnore]
        public RestaurantMenu RestaurantMenuModel { get; set; }
    }
}
