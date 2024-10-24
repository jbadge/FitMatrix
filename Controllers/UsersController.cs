using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using FitMatrix.Models;
using System.Linq;
using System;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Npgsql.Internal.TypeHandlers.NetworkHandlers;

namespace FitMatrix.Controllers
{
    // All of these routes will be at the base URL:     /api/Users
    // That is what "api/[controller]" means below. It uses the name of the controller
    // in this case UsersController to determine the URL
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        // This is the variable you use to have access to your database
        private readonly DatabaseContext _context;

        // Constructor that receives a reference to your database context
        // and stores it in _context for you to use in your API methods
        public UsersController(DatabaseContext context)
        {
            _context = context;
        }

        // GET: api/Users/5
        //
        // Fetches and returns a specific user by finding it by id. The id is specified in the
        // URL. In the sample URL above it is the `5`.  The "{id}" in the [HttpGet("{id}")] is what tells dotnet
        // to grab the id from the URL. It is then made available to us as the `id` argument to the method.
        //
        [HttpGet("{id}")]
        public async Task<ActionResult<User>> GetUser(int id)
        {
            // Find the user in the database using `FindAsync` to look it up by id
            // var user = await _context.Users.FindAsync(id);
            var user = await _context.Users.Include(user => user.Stats).Include(user => user.Goal).Include(user => user.Progress).Include(user => user.Measurements).FirstOrDefaultAsync(x => x.Id == id);

            // If we didn't find anything, we receive a `null` in return
            if (user == null)
            {
                // Return a `404` response to the client indicating we could not find a user with this id
                return NotFound();
            }

            // Return the user as a JSON object.
            return user;
        }

        // PUT: api/Users/5
        //
        // Update an individual user with the requested id. The id is specified in the URL
        // In the sample URL above it is the `5`. The "{id} in the [HttpPut("{id}")] is what tells dotnet
        // to grab the id from the URL. It is then made available to us as the `id` argument to the method.
        //
        // In addition the `body` of the request is parsed and then made available to us as a User
        // variable named user. The controller matches the keys of the JSON object the client
        // supplies to the names of the attributes of our User POCO class. This represents the
        // new values for the record.
        //
        [HttpPut("{id}")]
        public async Task<IActionResult> PutUser(int id, User user)
        {
            // If the ID in the URL does not match the ID in the supplied request body, return a bad request
            if (id != user.Id)
            {
                return BadRequest();
            }

            // Tell the database to consider everything in user to be _updated_ values. When
            // the save happens the database will _replace_ the values in the database with the ones from user
            _context.Entry(user).State = EntityState.Modified;

            try
            {
                // Try to save these changes.
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                // Ooops, looks like there was an error, so check to see if the record we were
                // updating no longer exists.
                if (!UserExists(id))
                {
                    // If the record we tried to update was already deleted by someone else,
                    // return a `404` not found
                    return NotFound();
                }
                else
                {
                    // Otherwise throw the error back, which will cause the request to fail
                    // and generate an error to the client.
                    throw;
                }
            }

            Console.WriteLine(user);
            // Return a copy of the updated data
            return Ok(user);
        }

        // POST: api/Users
        //
        // Creates a new user in the database.
        //
        // The `body` of the request is parsed and then made available to us as a User
        // variable named user. The controller matches the keys of the JSON object the client
        // supplies to the names of the attributes of our User POCO class. This represents the
        // new values for the record.
        //
        [HttpPost]
        public async Task<ActionResult<User>> PostUser(User user)
        {
            try
            {
                // Indicate to the database context we want to add this new record
                _context.Users.Add(user);
                await _context.SaveChangesAsync();

                // Return a response that indicates the object was created (status code `201`) and some additional
                // headers with details of the newly created object.
                return CreatedAtAction("GetUser", new { id = user.Id }, user);
            }
            catch (DbUpdateException)
            {
                // Make a custom error response
                var response = new
                {
                    status = 400,
                    errors = new List<string>() { "This account already exists!" }
                };

                // Return our error with the custom response
                return BadRequest(response);
            }
        }

        // Add stats to a user
        // POST: /api/Users/5/Stats
        [HttpPost("{userId}/stats")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<ActionResult<Stats>> CreateStatsForUser(int userId, Stats stats)
        {
            var user = await _context.Users.FindAsync(userId);

            if (user == null)
            {
                return NotFound();
            }

            _context.Stats.Add(stats);
            await _context.SaveChangesAsync();
            return CreatedAtAction("GetStats", new { id = stats.Id }, stats);
        }

        // Updates measurements to a user
        // PUT: /api/Users/5/Measurements/2
        [HttpPut("{userId}/measurements/{id}")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<ActionResult<Progress>> CreateMeasurementsForUser(int userId, int id, Measurements measurements)
        {

            if (id != measurements.Id)
            {
                return BadRequest();
            }

            var user = await _context.Users.FindAsync(userId);

            if (user == null)
            {
                return NotFound();
            }

            _context.Entry(measurements).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                // Ooops, looks like there was an error, so check to see if the record we were
                // updating no longer exists.
                if (!MeasurementsExists(id))
                {
                    // If the record we tried to update was already deleted by someone else,
                    // return a `404` not found
                    return NotFound();
                }
                else
                {
                    // Otherwise throw the error back, which will cause the request to fail
                    // and generate an error to the client.
                    throw;
                }
            }
            // Return a copy of the updated data
            // return CreatedAtAction("GetMeasurements", new { id = measurements.Id }, measurements);
            return Ok(measurements);
        }

        // Add measurements to a user
        // POST: /api/Users/5/Measurements
        [HttpPost("{userId}/measurements")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<ActionResult<Stats>> CreateMeasurementsForUser(int userId, Measurements measurements)
        {
            // stats.UserId = GetCurrentUserId();
            var user = await _context.Users.FindAsync(userId);

            if (user == null)
            {
                return NotFound();
            }

            _context.Measurements.Add(measurements);
            await _context.SaveChangesAsync();
            return CreatedAtAction("GetStats", new { id = measurements.Id }, measurements);
        }

        // Add goal to a user
        // POST: /api/Users/5/Goal
        [HttpPost("{userId}/goal")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<ActionResult<Goal>> CreateGoalForUser(int userId, Goal goal)
        {

            var user = await _context.Users.FindAsync(userId);

            if (user == null)
            {
                return NotFound();
            }

            _context.Goals.Add(goal);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetGoal", new { id = goal.Id }, goal);
        }

        // Updates progress to a user
        // PUT: /api/Users/5/Progress/2
        [HttpPut("{userId}/progress/{id}")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<ActionResult<Progress>> CreateProgressForUser(int userId, int id, Progress progress)
        {

            if (id != progress.Id)
            {
                return BadRequest();
            }

            var user = await _context.Users.FindAsync(userId);

            if (user == null)
            {
                return NotFound();
            }

            _context.Entry(progress).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                // Ooops, looks like there was an error, so check to see if the record we were
                // updating no longer exists.
                if (!ProgressExists(id))
                {
                    // If the record we tried to update was already deleted by someone else,
                    // return a `404` not found
                    return NotFound();
                }
                else
                {
                    // Otherwise throw the error back, which will cause the request to fail
                    // and generate an error to the client.
                    throw;
                }
            }
            // Return a copy of the updated data
            // return CreatedAtAction("GetProgress", new { id = progress.Id }, progress);
            return Ok(progress);
        }


        // Add progress to a user
        // POST: /api/Users/5/Progress
        [HttpPost("{userId}/progress")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<ActionResult<Progress>> CreateProgressForUser(int userId, Progress progress)
        {

            var user = await _context.Users.FindAsync(userId);

            if (user == null)
            {
                return NotFound();
            }

            _context.Progress.Add(progress);
            await _context.SaveChangesAsync();
            return CreatedAtAction("GetProgress", new { id = progress.Id }, progress);
        }


        // Private helper method that looks up an existing user by the supplied id
        private bool UserExists(int id)
        {
            return _context.Users.Any(user => user.Id == id);
        }

        private bool ProgressExists(int id)
        {
            return _context.Progress.Any(progress => progress.Id == id);
        }

        private bool MeasurementsExists(int id)
        {
            return _context.Measurements.Any(measurements => measurements.Id == id);
        }

        // Private helper method to get the JWT claim related to the user ID
        private int GetCurrentUserId()
        {
            //  if (user == null)
            // {
            //     return NotFound();
            // }
            // Get the User Id from the claim and then parse it as an integer.
            return int.Parse(User.Claims.FirstOrDefault(claim => claim.Type == "Id").Value);
        }

    }
}