using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using FitMatrix.Models;

namespace FitMatrix.Controllers
{
    // All of these routes will be at the base URL:     /api/Goals
    // That is what "api/[controller]" means below. It uses the name of the controller
    // in this case GoalsController to determine the URL
    [Route("api/[controller]")]
    [ApiController]
    public class GoalsController : ControllerBase
    {
        // This is the variable you use to have access to your database
        private readonly DatabaseContext _context;

        // Constructor that recives a reference to your database context
        // and stores it in _context for you to use in your API methods
        public GoalsController(DatabaseContext context)
        {
            _context = context;
        }

        // GET: api/Goals
        //
        // Returns a list of all your Goals
        //
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Goal>>> GetGoal()
        {
            // Uses the database context in `_context` to request all of the Goal, sort
            // them by row id and return them as a JSON array.
            return await _context.Goal.OrderBy(row => row.Id).ToListAsync();
        }

        // GET: api/Goals/5
        //
        // Fetches and returns a specific goal by finding it by id. The id is specified in the
        // URL. In the sample URL above it is the `5`.  The "{id}" in the [HttpGet("{id}")] is what tells dotnet
        // to grab the id from the URL. It is then made available to us as the `id` argument to the method.
        //
        [HttpGet("{id}")]
        public async Task<ActionResult<Goal>> GetGoal(int id)
        {
            // Find the goal in the database using `FindAsync` to look it up by id
            var goal = await _context.Goal.FindAsync(id);

            // If we didn't find anything, we receive a `null` in return
            if (goal == null)
            {
                // Return a `404` response to the client indicating we could not find a goal with this id
                return NotFound();
            }

            //  Return the goal as a JSON object.
            return goal;
        }

        // PUT: api/Goals/5
        //
        // Update an individual goal with the requested id. The id is specified in the URL
        // In the sample URL above it is the `5`. The "{id} in the [HttpPut("{id}")] is what tells dotnet
        // to grab the id from the URL. It is then made available to us as the `id` argument to the method.
        //
        // In addition the `body` of the request is parsed and then made available to us as a Goal
        // variable named goal. The controller matches the keys of the JSON object the client
        // supplies to the names of the attributes of our Goal POCO class. This represents the
        // new values for the record.
        //
        [HttpPut("{id}")]
        public async Task<IActionResult> PutGoal(int id, Goal goal)
        {
            // If the ID in the URL does not match the ID in the supplied request body, return a bad request
            if (id != goal.Id)
            {
                return BadRequest();
            }

            // Tell the database to consider everything in goal to be _updated_ values. When
            // the save happens the database will _replace_ the values in the database with the ones from goal
            _context.Entry(goal).State = EntityState.Modified;

            try
            {
                // Try to save these changes.
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                // Ooops, looks like there was an error, so check to see if the record we were
                // updating no longer exists.
                if (!GoalExists(id))
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
            return Ok(goal);
        }

        // POST: api/Goals
        //
        // Creates a new goal in the database.
        //
        // The `body` of the request is parsed and then made available to us as a Goal
        // variable named goal. The controller matches the keys of the JSON object the client
        // supplies to the names of the attributes of our Goal POCO class. This represents the
        // new values for the record.
        //
        [HttpPost]
        public async Task<ActionResult<Goal>> PostGoal(Goal goal)
        {
            // Indicate to the database context we want to add this new record
            _context.Goal.Add(goal);
            await _context.SaveChangesAsync();

            // Return a response that indicates the object was created (status code `201`) and some additional
            // headers with details of the newly created object.
            return CreatedAtAction("GetGoal", new { id = goal.Id }, goal);
        }

        // DELETE: api/Goals/5
        //
        // Deletes an individual goal with the requested id. The id is specified in the URL
        // In the sample URL above it is the `5`. The "{id} in the [HttpDelete("{id}")] is what tells dotnet
        // to grab the id from the URL. It is then made available to us as the `id` argument to the method.
        //
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteGoal(int id)
        {
            // Find this goal by looking for the specific id
            var goal = await _context.Goal.FindAsync(id);
            if (goal == null)
            {
                // There wasn't a goal with that id so return a `404` not found
                return NotFound();
            }

            // Tell the database we want to remove this record
            _context.Goal.Remove(goal);

            // Tell the database to perform the deletion
            await _context.SaveChangesAsync();

            // Return a copy of the deleted data
            return Ok(goal);
        }

        // Private helper method that looks up an existing goal by the supplied id
        private bool GoalExists(int id)
        {
            return _context.Goal.Any(goal => goal.Id == id);
        }
    }
}
