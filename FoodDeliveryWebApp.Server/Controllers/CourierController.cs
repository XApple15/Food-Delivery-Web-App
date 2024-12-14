using Microsoft.AspNetCore.Mvc;

namespace FoodDeliveryWebApp.Server.Controllers
{
    public class CourierController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
