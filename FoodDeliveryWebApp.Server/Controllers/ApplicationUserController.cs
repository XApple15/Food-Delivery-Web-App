using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using FoodDeliveryWebApp.API.CustomActionFilter;
using FoodDeliveryWebApp.API.Data;
using FoodDeliveryWebApp.API.Models.Domain;
using FoodDeliveryWebApp.API.Models.DTO;
using FoodDeliveryWebApp.API.Repositories;

namespace FoodDeliveryWebApp.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ApplicationUserController : ControllerBase
    {
        private readonly Data.WarehouseDButils _db;
        private readonly IApplicationUserRepository _UserRepository;
        private readonly IMapper _mapper;

        public ApplicationUserController(WarehouseDButils db, IApplicationUserRepository UserRepository, IMapper mapper)
        {
            this._db = db;
            this._UserRepository = UserRepository;
            this._mapper = mapper;
        }


        //POST create a new User
        //POST : localhost:7106/api/User
        [HttpPost]
        [ValidateModel]
        public async Task<IActionResult> Create([FromBody] AddClientDTO addUserDTO)
        {
            var UserModel = _mapper.Map<ApplicationUser>(addUserDTO);
           // UserModel = await _UserRepository.CreateAsync(UserModel);

            var UserDTO = _mapper.Map<UserDTO>(UserModel);
            return CreatedAtAction(nameof(GetById), new { id = UserDTO.Id }, UserDTO);
        }


        //GET all Users
        //GET : localhost:7106/api/category
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var UserModel = await _UserRepository.GetAllAsync();
            var usersDTO = await _UserRepository.GetAllWithRoleAsync(UserModel);
            var output = _mapper.Map<List<UserDTO>>(usersDTO);
            return Ok(output);
        }

        //GET User by id
        //GET : localhost:7106/api/User/{id}
        [HttpGet]
        [Route("{id}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var UserModel = await _UserRepository.GetByIdAsync(id);
            if (UserModel == null)
            {
                return NotFound();
            }
            var UserDTO = _mapper.Map<UserDTO>(UserModel);
            return Ok(UserDTO);
        }


        //PUT update a User
        //PUT : localhost:7106/api/User/{id}
        [HttpPut]
        [Route("{id}")]
        [ValidateModel]
        public async Task<IActionResult> Update([FromRoute] Guid id, [FromBody] UserDTO addUserDTO)
        { 
            var UserModel = _mapper.Map<UserDTO>(addUserDTO);
            var AppUserModel = await _UserRepository.UpdateAsync(id, UserModel);
            if(AppUserModel == null)
            {
                return NotFound();
            }
            var UserDTO = _mapper.Map<UserDTO>(UserModel);
            return Ok(UserDTO);
        }


        //DELETE a User
        //DELETE : localhost:7106/api/User/{id}
        [HttpDelete]
        [Route("{id}")]
        public async Task<IActionResult> Delete([FromRoute] Guid id)
        {
            var UserModel = await _UserRepository.DeleteAsync(id);

            if(UserModel == null)
            {
                return NotFound();
            }

            var UserDTO = _mapper.Map<UserDTO>(UserModel);
            return Ok(UserDTO);
        }
    }
}
