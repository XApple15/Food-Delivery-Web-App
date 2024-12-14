using FoodDeliveryWebApp.Server.Enums;
using FoodDeliveryWebApp.Server.Models.Domain;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using FoodDeliveryWebApp.API.Models.Domain;

namespace FoodDeliveryWebApp.API.Data
{
    public class WarehouseDButils : IdentityDbContext<ApplicationUser>
    {
        public WarehouseDButils(DbContextOptions<WarehouseDButils> options) : base(options)
        {
        }
       
        public DbSet<Orders> Orders { get; set; }
        public DbSet<Image> Images { get; set; }
        public DbSet<ApplicationUser> ApplicationUsers { get; set; }
        public DbSet<OrderDetails> OrderDetails { get; set; }
        public DbSet<Restaurant> Restaurants { get; set; }
        public DbSet<RestaurantMenu> RestaurantMenus { get; set; }




        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            var normalUserID = "5bf2857f-3d64-447f-824a-b8125a00a014";
            var adminUserID = "212d6dca-8a13-45cc-9492-919ec0c39e8f";
            var courierID = "697479e1-3bd9-4c68-8866-0d86a042b168";
            var restaurantID = "17403251-b4fa-4fa5-8bfb-72bca64cbdef";

            var roles = new List<IdentityRole>
            {
                new IdentityRole {
                    Id = normalUserID,
                    ConcurrencyStamp = normalUserID,
                    Name = "Client",
                    NormalizedName = "CLIENT"
                },
                new IdentityRole {
                    Id = adminUserID,
                    ConcurrencyStamp = adminUserID,
                    Name = "Admin",
                    NormalizedName = "ADMIN"
                },
                new IdentityRole {
                    Id = courierID,
                    ConcurrencyStamp = courierID,
                    Name = "Courier",
                    NormalizedName = "COURIER"
                },
                new IdentityRole {
                    Id = restaurantID,
                    ConcurrencyStamp = restaurantID,
                    Name = "Restaurant",
                    NormalizedName = "RESTAURANT"
                }
            };
            modelBuilder.Entity<IdentityRole>().HasData(roles);


            

            modelBuilder.Entity<Orders>()
                .HasOne(o => o.UserModel)
                .WithMany()
                .HasForeignKey(o => o.UserId)
                .OnDelete(DeleteBehavior.NoAction); // Configure OnDelete behavior

            modelBuilder.Entity<Orders>()
                .HasOne(o => o.RestaurantModel)
                .WithMany()
                .HasForeignKey(o => o.RestaurantId)
                .OnDelete(DeleteBehavior.NoAction); // Configure OnDelete behavior

            // If you decide to add CourierModel navigation property
            modelBuilder.Entity<Orders>()
                .HasOne(o => o.CourierModel)
                .WithMany()
                .HasForeignKey(o => o.CourierId)
                .OnDelete(DeleteBehavior.NoAction); // Configure OnDelete behavior
            modelBuilder.Entity<Restaurant>()
                .HasOne(o => o.ApplicationUserModel)
                .WithMany()
                .HasForeignKey(o => o.ApplicationUserId);
    }
    }

}
