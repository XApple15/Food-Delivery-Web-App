using FoodDeliveryWebApp.API.Models.Domain;
using FoodDeliveryWebApp.API.Models.DTO;
using FoodDeliveryWebApp.Server.Models.Domain;

namespace FoodDeliveryWebApp.API.Repositories
{
    public interface IApplicationUserRepository
    {
        Task<List<ApplicationUser>> GetAllAsync();
        Task<List<UserDTO>> GetAllWithRoleAsync(List<ApplicationUser> applicationUsersList);
        Task<List<ApplicationUser>> GetAllAsyncByRole(string role);
        Task<ApplicationUser> GetByIdAsync(Guid id);
        Task<ApplicationUser> CreateAsync(ApplicationUser user);
        Task<ApplicationUser> UpdateAsync(Guid id, UserDTO user);
        Task<ApplicationUser> DeleteAsync(Guid id);
    }
}
