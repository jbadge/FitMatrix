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
    // All of these routes will be at the base URL:     /api/Progress
    // That is what "api/[controller]" means below. It uses the name of the controller
    // in this case ProgressController to determine the URL
    [Route("api/[controller]")]
    [ApiController]
    public class ProgressController : ControllerBase
    {
        // This is the variable you use to have access to your database
        private readonly DatabaseContext _context;

        // Constructor that recives a reference to your database context
        // and stores it in _context for you to use in your API methods
        public ProgressController(DatabaseContext context)
        {
            _context = context;
        }

        // GET: api/Progress
        //
        // Returns a list of all your Progress
        //
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Progress>>> GetProgress()
        {
            // Uses the database context in `_context` to request all of the Progress, sort
            // them by row id and return them as a JSON array.
            return await _context.Progress.OrderBy(row => row.Id).ToListAsync();
        }

        // GET: api/Progress/5
        //
        // Fetches and returns a specific progress by finding it by id. The id is specified in the
        // URL. In the sample URL above it is the `5`.  The "{id}" in the [HttpGet("{id}")] is what tells dotnet
        // to grab the id from the URL. It is then made available to us as the `id` argument to the method.
        //
        [HttpGet("{id}")]
        public async Task<ActionResult<Progress>> GetProgress(int id)
        {
            // Find the progress in the database using `FindAsync` to look it up by id
            var progress = await _context.Progress.FindAsync(id);

            // If we didn't find anything, we receive a `null` in return
            if (progress == null)
            {
                // Return a `404` response to the client indicating we could not find a progress with this id
                return NotFound();
            }

            //  Return the progress as a JSON object.
            return progress;
        }

        // PUT: api/Progress/5
        //
        // Update an individual progress with the requested id. The id is specified in the URL
        // In the sample URL above it is the `5`. The "{id} in the [HttpPut("{id}")] is what tells dotnet
        // to grab the id from the URL. It is then made available to us as the `id` argument to the method.
        //
        // In addition the `body` of the request is parsed and then made available to us as a Progress
        // variable named progress. The controller matches the keys of the JSON object the client
        // supplies to the names of the attributes of our Progress POCO class. This represents the
        // new values for the record.
        //
        [HttpPut("{id}")]
        public async Task<IActionResult> PutProgress(int id, Progress progress)
        {
            // If the ID in the URL does not match the ID in the supplied request body, return a bad request
            if (id != progress.Id)
            {
                return BadRequest();
            }

            // Tell the database to consider everything in progress to be _updated_ values. When
            // the save happens the database will _replace_ the values in the database with the ones from progress
            _context.Entry(progress).State = EntityState.Modified;

            try
            {
                // Try to save these changes.
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
            return Ok(progress);
        }

        // POST: api/Progress
        //
        // Creates a new progress in the database.
        //
        // The `body` of the request is parsed and then made available to us as a Progress
        // variable named progress. The controller matches the keys of the JSON object the client
        // supplies to the names of the attributes of our Progress POCO class. This represents the
        // new values for the record.
        //
        [HttpPost]
        public async Task<ActionResult<Progress>> PostProgress(Progress progress)
        {
            // Indicate to the database context we want to add this new record
            _context.Progress.Add(progress);
            await _context.SaveChangesAsync();

            // Return a response that indicates the object was created (status code `201`) and some additional
            // headers with details of the newly created object.
            return CreatedAtAction("GetProgress", new { id = progress.Id }, progress);
        }

        // DELETE: api/Progress/5
        //
        // Deletes an individual progress with the requested id. The id is specified in the URL
        // In the sample URL above it is the `5`. The "{id} in the [HttpDelete("{id}")] is what tells dotnet
        // to grab the id from the URL. It is then made available to us as the `id` argument to the method.
        //
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProgress(int id)
        {
            // Find this progress by looking for the specific id
            var progress = await _context.Progress.FindAsync(id);
            if (progress == null)
            {
                // There wasn't a progress with that id so return a `404` not found
                return NotFound();
            }

            // Tell the database we want to remove this record
            _context.Progress.Remove(progress);

            // Tell the database to perform the deletion
            await _context.SaveChangesAsync();

            // Return a copy of the deleted data
            return Ok(progress);
        }

        // Private helper method that looks up an existing progress by the supplied id
        private bool ProgressExists(int id)
        {
            return _context.Progress.Any(progress => progress.Id == id);
        }
    }
}
