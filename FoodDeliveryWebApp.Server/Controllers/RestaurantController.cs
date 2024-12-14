using AutoMapper;
using FoodDeliveryWebApp.API.CustomActionFilter;
using FoodDeliveryWebApp.API.Data;
using FoodDeliveryWebApp.Server.Models.Domain;
using FoodDeliveryWebApp.Server.Models.DTO;
using FoodDeliveryWebApp.Server.Repositories;
using Microsoft.AspNetCore.Mvc;
using System.Runtime.CompilerServices;

namespace FoodDeliveryWebApp.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RestaurantController : ControllerBase
    {
        private readonly WarehouseDButils _db;
        private readonly IRestaurantRepository _restaurantRepository;
        private readonly IMapper _mapper;

        public RestaurantController(WarehouseDButils db, IRestaurantRepository restaurantRepository, IMapper mapper)
        {
            this._db = db;
            this._restaurantRepository = restaurantRepository;
            this._mapper = mapper;
        }


        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] string? applicationUserId)
        {
            var restaurants = await _restaurantRepository.GetAll(applicationUserId);
            var restaurantDTO = _mapper.Map<List<RestaurantDTO>>(restaurants);
            return Ok(restaurantDTO);
        }


        [HttpGet]
        [Route("{id}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var restaurant = await _restaurantRepository.GetByIdAsync(id);
            if(restaurant == null)
            {
                return NotFound();
            }
            var restaurantDTO = _mapper.Map<RestaurantDTO>(restaurant);
            return Ok(restaurantDTO);
        }


        [HttpPost]
        [ValidateModel]
        public async Task<IActionResult> Create([FromBody] AddRestaurantDTO restaurantDTO)
        {
            var restaurant = _mapper.Map<Restaurant>(restaurantDTO);
            await _restaurantRepository.Create(restaurant);
            return CreatedAtAction(nameof(GetById), new { id = restaurant.Id }, restaurant);
        }


        [HttpPut("{id}")]
        [ValidateModel]
        public async Task<IActionResult> Update(Guid id, [FromBody] RestaurantDTO addRestaurantDTO)
        {
            var restaurantModel = _mapper.Map<Restaurant>(addRestaurantDTO);
            restaurantModel = await _restaurantRepository.Update(id, restaurantModel);
            if(restaurantModel == null)
            {
                return NotFound();
            }

            var restaurantDTO = _mapper.Map<RestaurantDTO>(restaurantModel);
            return Ok(restaurantDTO);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var restaurant = await _restaurantRepository.DeleteAsync(id);
            if (restaurant == null)
            {
                return NotFound();
            }
            
            var restaurantDTO = _mapper.Map<RestaurantDTO>(restaurant);
            return Ok(restaurantDTO);
        }
    }
}
