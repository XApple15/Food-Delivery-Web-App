namespace FoodDeliveryWebApp.API.Models.Domain
{
    public class Orders
    {
        public Guid Id { get; set; }
        public DateTime OrderDate { get; set; }

        public int Quantity { get; set; }
        public double Total { get; set; }
        //public Guid UserId { get; set; }
        //public Guid ProductId { get; set; }

      //  public ApplicationUser UserModel { get; set; }
        //public Products Product { get; set; }

    }
}
