using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using ECommerceApp.Models;

namespace ECommerceApp.Controllers
{
    [Route("api/auth")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _config;

        public AuthController(AppDbContext context, IConfiguration config)
        {
            _context = context;
            _config = config;
        }

        [HttpPost("register")]
        public IActionResult Register(User user)
        {
            if (_context.Users.Any(u => u.Username == user.Username))
                return BadRequest("Username already exists");

            // ✅ Keep role from request, default to Customer
            if (string.IsNullOrEmpty(user.Role))
                user.Role = "Customer";

            _context.Users.Add(user);
            _context.SaveChanges();
            return Ok("User registered successfully");
        }

        [HttpPost("login")]
        public IActionResult Login(User user)
        {
            var existingUser = _context.Users
                .FirstOrDefault(u => u.Username == user.Username
                               && u.Password == user.Password);

            if (existingUser == null)
                return Unauthorized("Invalid username or password");

            var key = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(_config["Jwt:Key"]));

            var credentials = new SigningCredentials(
                key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(ClaimTypes.Name, existingUser.Username),
                new Claim(ClaimTypes.Role, existingUser.Role),
                new Claim(ClaimTypes.NameIdentifier,
                         existingUser.Id.ToString())
            };

            var token = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"],
                audience: _config["Jwt:Audience"],
                claims: claims,
                expires: DateTime.Now.AddHours(1),
                signingCredentials: credentials
            );

            return Ok(new
            {
                token = new JwtSecurityTokenHandler().WriteToken(token),
                role = existingUser.Role,
                username = existingUser.Username
            });
        }
    }
}