using FoodDeliveryWebApp.API.Data;
using FoodDeliveryWebApp.API.Models.Domain;

namespace FoodDeliveryWebApp.API.Repositories
{
    public class LocalImageRepository : IImageRepository
    {
        private readonly IWebHostEnvironment _webHost;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly WarehouseDButils _warehouseDButils;
        public LocalImageRepository(IWebHostEnvironment webHost,IHttpContextAccessor httpContextAccessor,WarehouseDButils warehouseDButils)
        {
            this._webHost = webHost;
            this._httpContextAccessor = httpContextAccessor; 
            this._warehouseDButils = warehouseDButils;  
        }
        public async Task<Image> Upload(Image image)
        {
            var localFilePath = Path.Combine(_webHost.ContentRootPath, "Images", 
                $"{image.FileName}{image.FileExtension}");
            
            using var stream = new FileStream(localFilePath, FileMode.Create);
            await image.File.CopyToAsync(stream);

            var urlFilePath = $"{_httpContextAccessor.HttpContext.Request.Scheme}://{_httpContextAccessor.HttpContext.Request.Host}{_httpContextAccessor.HttpContext.Request.PathBase}/Images/{image.FileName}{image.FileExtension}";

            image.FilePath = urlFilePath;

            //add img to db
            await _warehouseDButils.Images.AddAsync(image);
            await _warehouseDButils.SaveChangesAsync();

            return image;
        }
    }
}
