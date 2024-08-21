using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using FitMatrix.Models;
using FitMatrix.Utils;

namespace FitMatrix.Controllers
{
    public class LoginUser
    {
        public string Email { get; set; }
        public string Password { get; set; }
    }

    // All of these routes will be at the base URL:     /api/Sessions
    // That is what "api/[controller]" means below. It uses the name of the controller
    // in this case RestaurantsController to determine the URL
    [Route("api/[controller]")]
    [ApiController]
    public class SessionsController : ControllerBase
    {
        // This is the variable you use to have access to your database
        private readonly DatabaseContext _context;

        readonly protected string JWT_KEY;

        // Constructor that receives a reference to your database context
        // and stores it in _context_ for you to use in your API methods
        public SessionsController(DatabaseContext context, IConfiguration config)
        {
            _context = context;
            JWT_KEY = config["JWT_KEY"];
        }
        [HttpPost]
        public async Task<ActionResult> Login(LoginUser loginUser)
        {
            var foundUser = await _context.Users.FirstOrDefaultAsync(user => user.Email == loginUser.Email);

            if (foundUser != null && foundUser.IsValidPassword(loginUser.Password))
            {
                var response = new
                {
                    token = new TokenGenerator(JWT_KEY).TokenFor(foundUser),

                    user = foundUser
                };

                return Ok(response);
            }
            else
            {
                var response = new
                {
                    status = 400,
                    errors = new List<string>() { "User does not exist" }
                };

                return BadRequest(response);
            }
        }
    }
}