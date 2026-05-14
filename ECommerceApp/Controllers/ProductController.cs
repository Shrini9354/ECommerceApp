using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ECommerceApp.Models;

namespace ECommerceApp.Controllers
{
    [Route("api/products")]
    [ApiController]
    public class ProductController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ProductController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/products (everyone can see products)
        [HttpGet]
        public IActionResult GetAll()
        {
            var products = _context.Products
                .Select(p => new
                {
                    p.Id,
                    p.Name,
                    p.Description,
                    p.Price,
                    p.Stock,
                    p.ImageUrl,
                    Category = p.Category.Name
                }).ToList();
            return Ok(products);
        }

        // GET: api/products/1
        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            var product = _context.Products
                .Where(p => p.Id == id)
                .Select(p => new
                {
                    p.Id,
                    p.Name,
                    p.Description,
                    p.Price,
                    p.Stock,
                    p.ImageUrl,
                    Category = p.Category.Name
                }).FirstOrDefault();

            if (product == null) return NotFound();
            return Ok(product);
        }

        // POST: api/products (only Admin)
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public IActionResult Create(Product product)
        {
            _context.Products.Add(product);
            _context.SaveChanges();
            return Ok(product);
        }

        // PUT: api/products/1 (only Admin)
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public IActionResult Update(int id, Product product)
        {
            var existing = _context.Products.Find(id);
            if (existing == null) return NotFound();
            existing.Name = product.Name;
            existing.Description = product.Description;
            existing.Price = product.Price;
            existing.Stock = product.Stock;
            existing.ImageUrl = product.ImageUrl;
            existing.CategoryId = product.CategoryId;
            _context.SaveChanges();
            return Ok(existing);
        }

        // DELETE: api/products/1 (only Admin)
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public IActionResult Delete(int id)
        {
            var product = _context.Products.Find(id);
            if (product == null) return NotFound();
            _context.Products.Remove(product);
            _context.SaveChanges();
            return Ok("Product deleted successfully");
        }
    }
}