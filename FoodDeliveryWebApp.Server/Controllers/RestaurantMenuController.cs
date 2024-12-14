using AutoMapper;
using FoodDeliveryWebApp.API.CustomActionFilter;
using FoodDeliveryWebApp.API.Data;
using FoodDeliveryWebApp.Server.Models.Domain;
using FoodDeliveryWebApp.Server.Models.DTO;
using FoodDeliveryWebApp.Server.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace FoodDeliveryWebApp.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RestaurantMenuController : Controller
    {
        private readonly WarehouseDButils _db;
        private readonly IRestaurantMenuRepository _restaurantMenuRepository;
        private readonly IMapper _mapper;

        public RestaurantMenuController(WarehouseDButils db, IRestaurantMenuRepository restaurantMenuRepository, IMapper mapper)
        {
            this._db = db;
            this._restaurantMenuRepository = restaurantMenuRepository;
            this._mapper = mapper;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] string? restaurantid)
        {
            var restaurantMenus = await _restaurantMenuRepository.GetAll(restaurantid);
            var restaurantMenuDTO = _mapper.Map<List<RestaurantMenuDTO>>(restaurantMenus);
            return Ok(restaurantMenuDTO);
        }

        [HttpGet]
        [Route("{id}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var restaurantMenu = await _restaurantMenuRepository.GetByIdAsync(id);
            if (restaurantMenu == null)
            {
                return NotFound();
            }
            var restaurantMenuDTO = _mapper.Map<RestaurantMenuDTO>(restaurantMenu);
            return Ok(restaurantMenuDTO);
        }

        [HttpPost]
        [ValidateModel]
        public async Task<IActionResult> Create([FromBody] RestaurantMenuDTO restaurantMenuDTO)
        {
            var restaurantMenu = _mapper.Map<RestaurantMenu>(restaurantMenuDTO);
            await _restaurantMenuRepository.Create(restaurantMenu);
            return CreatedAtAction(nameof(GetById), new { id = restaurantMenu.Id }, restaurantMenu);
        }

        [HttpPut("{id}")]
        [ValidateModel]
        public async Task<IActionResult> Update(Guid id, [FromBody] RestaurantMenuDTO restaurantMenuDTO)
        {
            var restaurantMenu = _mapper.Map<RestaurantMenu>(restaurantMenuDTO);
            var updatedRestaurantMenu = await _restaurantMenuRepository.Update(id, restaurantMenu);
            if (updatedRestaurantMenu == null)
            {
                return NotFound();
            }
            return Ok(updatedRestaurantMenu);
        }
    }
}
