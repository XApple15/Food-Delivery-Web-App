using FoodDeliveryWebApp.API.Models.Domain;

namespace FoodDeliveryWebApp.API.Repositories
{
    public interface IImageRepository
    {
        Task<Image> Upload(Image image);
    }
}
