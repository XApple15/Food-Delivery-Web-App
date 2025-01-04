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
    public class OrderDetailsController : ControllerBase
    {
        private readonly WarehouseDButils _db;
        private readonly IOrderDetailsRepository _orderDetailsRepository;
        private readonly IMapper _mapper;

        public OrderDetailsController(WarehouseDButils db, IOrderDetailsRepository orderDetailsRepository, IMapper mapper)
        {
            this._db = db;
            this._orderDetailsRepository = orderDetailsRepository;
            this._mapper = mapper;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] string? orderId)
        {
            var orderDetails = await _orderDetailsRepository.GetAll(orderId);
            var orderDetailsDTO = _mapper.Map<List<OrderDetailsDTO>>(orderDetails);
            return Ok(orderDetailsDTO);
        }

        [HttpGet]
        [Route("{id}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var orderDetails = await _orderDetailsRepository.GetByIdAsync(id);
            if (orderDetails == null)
            {
                return NotFound();
            }
            var orderDetailsDTO = _mapper.Map<OrderDetailsDTO>(orderDetails);
            return Ok(orderDetailsDTO);
        }

        [HttpPost]
        [ValidateModel]
        public async Task<IActionResult> Create([FromBody] AddOrderDetailsDTO orderDetailsDTO)
        {
            var orderDetails = _mapper.Map<OrderDetails>(orderDetailsDTO);
            await _orderDetailsRepository.Create(orderDetails);
            return CreatedAtAction(nameof(GetById), new { id = orderDetails.Id }, orderDetails);
        }
    }
}
