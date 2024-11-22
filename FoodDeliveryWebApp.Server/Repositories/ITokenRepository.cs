using Microsoft.AspNetCore.Identity;

namespace FoodDeliveryWebApp.API.Repositories
{
    public interface ITokenRepository
    {
        string CreateJWTToken(IdentityUser user, List<string> roles);
    }
}
