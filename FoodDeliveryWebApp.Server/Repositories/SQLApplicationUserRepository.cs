using Microsoft.EntityFrameworkCore;
using FoodDeliveryWebApp.API.Data;
using FoodDeliveryWebApp.API.Models.Domain;
using FoodDeliveryWebApp.Server.Models.Domain;
using Microsoft.AspNetCore.Identity;
using FoodDeliveryWebApp.API.Models.DTO;
using AutoMapper;

namespace FoodDeliveryWebApp.API.Repositories
{
    public class SQLApplicationUserRepository : IApplicationUserRepository
    {
        private readonly WarehouseDButils _db;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IMapper _mapper;


        public SQLApplicationUserRepository(WarehouseDButils db, UserManager<ApplicationUser> userManager,IMapper mapper)
        {
            this._db = db;
            this._userManager = userManager;
            this._mapper = mapper;
        }

        public async Task<ApplicationUser> CreateAsync(ApplicationUser User)
        {
            await _db.ApplicationUsers.AddAsync(User); 
            await _db.SaveChangesAsync();
            return User;
        }

        public async Task<List<ApplicationUser>> GetAllAsync()
        {
            return await _db.Users.ToListAsync();
        }

        public async Task<List<UserDTO>> GetAllWithRoleAsync(List<ApplicationUser> applicationUsersList)
        {
            var usersDTOList =new List<UserDTO>();
            foreach (var user in applicationUsersList)
            {
               var currentUserDTO = _mapper.Map<UserDTO>(user);
              
                var currentRoles = await _userManager.GetRolesAsync(user);
                currentUserDTO.Role = currentRoles[0];
                usersDTOList.Add(currentUserDTO);
            }
            return usersDTOList;
        }



        public async Task<ApplicationUser> GetByIdAsync(Guid id)
        {
            return await _db.Users.FirstOrDefaultAsync(x => x.Id == id.ToString()); 
        }

        public async Task<ApplicationUser> UpdateAsync(Guid id, UserDTO User)
        {
            var existingUser = await _db.Users.FirstOrDefaultAsync(x => x.Id == id.ToString());  
            if (existingUser == null)
            {
                return null;
            }
            existingUser.UserName = User.UserName;
            existingUser.Name = User.Name;
            existingUser.Email = User.Email;
            existingUser.PhoneNumber = User.PhoneNumber;
            existingUser.Address = User.Address;

            var currentRoles = await _userManager.GetRolesAsync(existingUser);
            await _userManager.RemoveFromRolesAsync(existingUser, currentRoles);
            var result = await _userManager.AddToRoleAsync(existingUser, User.Role);

            if(!result.Succeeded)
            {
                return null;
            }

            existingUser.NormalUserData = User.NormalUserData;
            existingUser.AdminData = User.AdminData;
            existingUser.CourierData = User.CourierData;
            await _db.SaveChangesAsync();
            return existingUser;
        }

        public async Task<ApplicationUser> DeleteAsync(Guid id)
        {
            var existingUser = await _db.Users.FirstOrDefaultAsync(x => x.Id == id.ToString()); 
            if (existingUser == null)
            {
                return null;
            }
            _db.Users.Remove(existingUser); 
            await _db.SaveChangesAsync();
            return existingUser;
        }

        public async Task<List<ApplicationUser>> GetAllAsyncByRole(string role)
        {
            var usersInRole = await _userManager.GetUsersInRoleAsync(role);
            
            return usersInRole.ToList();
        }
    }
}
