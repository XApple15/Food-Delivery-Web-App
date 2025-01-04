using AutoMapper;
using FoodDeliveryWebApp.API.CustomActionFilter;
using FoodDeliveryWebApp.API.Data;
using FoodDeliveryWebApp.API.Models.Domain;
using FoodDeliveryWebApp.Server.Models.Domain;
using FoodDeliveryWebApp.Server.Models.DTO;
using FoodDeliveryWebApp.Server.Repositories;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

namespace FoodDeliveryWebApp.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrdersController : ControllerBase
    {
        private readonly WarehouseDButils _db;
        private readonly IOrdersRepository _ordersRepository;
        private readonly IHubContext<NotificationHub> _hubContext;
        private readonly IMapper _mapper;

        public OrdersController(WarehouseDButils db, IOrdersRepository ordersRepository, IMapper mapper, IHubContext<NotificationHub> hubContext)
        {
            this._db = db;
            this._ordersRepository = ordersRepository;
            this._hubContext = hubContext;
            this._mapper = mapper;
        }



        [HttpPut("{orderId}/acceptOrderByRestaurant" )]
        public async Task<IActionResult> AcceptOrderByRestaurant(Guid orderId)
        {
            var order = new UpdateOrderDTO
            {
                Status = "AcceptedByRestaurant"
            };

            var newOrder = await _ordersRepository.UpdateOrder(orderId, order);
            if(newOrder != null) {
                return Ok(order);
            }
            return NotFound();
        }

        [HttpPut("{orderId}/acceptOrderByCourier")]
        public async Task<IActionResult> AcceptOrderByCourier(Guid orderId)
        {
            var order = await _ordersRepository.GetByIdAsync(orderId);
            if (order == null)
            {
                return NotFound();
            }
            order.Status = "AcceptedByCourier";
            await _ordersRepository.UpdateOrder(orderId, _mapper.Map<UpdateOrderDTO>(order));
            return Ok(order);
        }

        [HttpPut("{orderId}/orderDelivered")]
        public async Task<IActionResult> OrderDelivered(Guid orderId)
        {
            var order = await _ordersRepository.GetByIdAsync(orderId);
            if (order == null)
            {
                return NotFound();
            }
            order.Status = "OrderDelivered";
            await _ordersRepository.UpdateOrder(orderId, _mapper.Map<UpdateOrderDTO>(order));
            return Ok(order);
        }


        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] string? applicationUserId, [FromQuery] string? restaurantId)
        {

        var orders = await _ordersRepository.GetAll(applicationUserId,restaurantId);
            var orderDTO = _mapper.Map<List<OrderDTO>>(orders);
            return Ok(orderDTO);
        }

        [HttpGet]
        [Route("{id}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var order = await _ordersRepository.GetByIdAsync(id);
            if (order == null)
            {
                return NotFound();
            }
            var orderDTO = _mapper.Map<OrderDTO>(order);
            return Ok(orderDTO);
        }


        [HttpPost]
        [ValidateModel]
        public async Task<IActionResult> Create([FromBody] AddOrderDTO orderDTO)
        {
            var order = _mapper.Map<Orders>(orderDTO);
            order.OrderDate = DateTime.Now;
            order.Status = "Pending";
            await _ordersRepository.Create(order);
            await _hubContext.Clients.Group(order.RestaurantId.ToString()).SendAsync("ReceiveOrder", order.Id.ToString());
                 
            return CreatedAtAction(nameof(GetById), new { id = order.Id }, order);
        }


        [HttpPut("{id}")]
        [ValidateModel]
        public async Task<IActionResult> Update(Guid id, [FromBody] UpdateOrderDTO orderDTO)
        {
            var updatedOrder = await _ordersRepository.UpdateOrder(id, orderDTO);
            if (updatedOrder == null)
            {
                return NotFound();
            }
              
            return Ok(updatedOrder);
        }
    }
}
