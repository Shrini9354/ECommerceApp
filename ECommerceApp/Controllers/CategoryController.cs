using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ECommerceApp.Models;

namespace ECommerceApp.Controllers
{
    [Route("api/categories")]
    [ApiController]
    public class CategoryController : ControllerBase
    {
        private readonly AppDbContext _context;

        public CategoryController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult GetAll()
        {
            return Ok(_context.Categories.ToList());
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public IActionResult Create(Category category)
        {
            _context.Categories.Add(category);
            _context.SaveChanges();
            return Ok(category);
        }
    }
}