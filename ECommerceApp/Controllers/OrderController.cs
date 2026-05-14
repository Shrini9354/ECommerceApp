using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using ECommerceApp.Models;

namespace ECommerceApp.Controllers
{
    [Route("api/orders")]
    [ApiController]
    [Authorize]
    public class OrderController : ControllerBase
    {
        private readonly AppDbContext _context;

        public OrderController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/orders (get my orders)
        [HttpGet]
        public IActionResult GetMyOrders()
        {
            var userId = int.Parse(User.FindFirst(
                ClaimTypes.NameIdentifier)!.Value);

            var orders = _context.Orders
                .Where(o => o.UserId == userId)
                .Select(o => new
                {
                    o.Id,
                    o.OrderDate,
                    o.Status,
                    o.TotalAmount,
                    Items = o.OrderItems.Select(i => new
                    {
                        i.ProductId,
                        i.Quantity,
                        i.Price
                    })
                }).ToList();

            return Ok(orders);
        }

        // POST: api/orders (place order)
        [HttpPost]
        public IActionResult PlaceOrder(List<OrderItem> items)
        {
            var userId = int.Parse(User.FindFirst(
                ClaimTypes.NameIdentifier)!.Value);

            decimal total = 0;
            foreach (var item in items)
            {
                var product = _context.Products.Find(item.ProductId);
                if (product == null) return BadRequest("Product not found");
                if (product.Stock < item.Quantity)
                    return BadRequest($"Not enough stock for {product.Name}");

                item.Price = product.Price * item.Quantity;
                total += item.Price;
                product.Stock -= item.Quantity;
            }

            var order = new Order
            {
                UserId = userId,
                TotalAmount = total,
                OrderItems = items
            };

            _context.Orders.Add(order);
            _context.SaveChanges();
            return Ok(new { message = "Order placed successfully!", orderId = order.Id });
        }
    }
}