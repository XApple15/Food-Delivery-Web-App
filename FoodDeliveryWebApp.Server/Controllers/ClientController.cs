using AutoMapper;
using FoodDeliveryWebApp.API.CustomActionFilter;
using FoodDeliveryWebApp.API.Data;
using FoodDeliveryWebApp.API.Models.Domain;
using FoodDeliveryWebApp.API.Models.DTO;
using FoodDeliveryWebApp.API.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FoodDeliveryWebApp.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ClientController : ControllerBase
    {
        private readonly API.Data.WarehouseDButils _db;
        private readonly IApplicationUserRepository _UserRepository;
        private readonly IMapper _mapper;

        public ClientController(WarehouseDButils db, IApplicationUserRepository UserRepository, IMapper mapper)
        {
            this._db = db;
            this._UserRepository = UserRepository;
            this._mapper = mapper;
        }

        [HttpGet]
        [Authorize(Roles = "Client")]
        public async Task<IActionResult> GetAll()
        {
            var allAppUsers = await _UserRepository.GetAllAsyncByRole("Client");
            var userDto = _mapper.Map<List<UserDTO>>(allAppUsers);
            Console.Write(userDto);
            return Ok(userDto);
        }

        [HttpPut]
        [Route("{id}")]
        [ValidateModel]
        public async Task<IActionResult> Update(Guid id, [FromBody] UserDTO userDTO)
        {
            var user = await _UserRepository.UpdateAsync(id, userDTO);
            if (user == null)
            {
                return NotFound();
            }
            return Ok(_mapper.Map<UserDTO>(user));
        }

    }
}
