using IBACS.Server.Data;
using IBACS.Server.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace IBACS.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LocationsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public LocationsController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Locations
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Location>>> GetLocations()
        {
            return await _context.Locations
                .Include(l => l.LocationType)
                .Include(l => l.ParentLocation)
                .Where(l => l.LocationName != "Main Building 01" && l.LocationName != "Main Building 02")
                .ToListAsync();
        }

        // GET: api/Locations/5
        [HttpGet("{locationKey}")]
        public async Task<ActionResult<Location>> GetLocation(int locationKey)
        {
            var location = await _context.Locations.FindAsync(locationKey);

            if (location == null)
            {
                return NotFound();
            }

            return location;
        }

        // GET: api/Locations/5/systems
        [HttpGet("{locationKey}/systems")]
        public async Task<ActionResult<IEnumerable<object>>> GetSystemsByLocation(int locationKey)
        {
            var systems = await _context.Systems
                .Where(s => s.LocationKey == locationKey) 
                .Select(s => new {
                    SystemKey = s.SystemKey,
                    Name = s.Name
                })
                .ToListAsync();

            return Ok(systems);
        }

        // POST: api/Locations
        [HttpPost]
        public async Task<ActionResult<Location>> PostLocation(Location location)
        {
            // Check if a location with the same name already exists to prevent duplicates
            bool exists = await _context.Locations.AnyAsync(l => l.LocationName == location.LocationName);
            if (exists)
            {
                return BadRequest(new { message = "A location with this name already exists. Please choose a different name." });
            }

            try
            {
                // Calculate full name based on hierarchy
                location.FullName = await CalculateFullName(location);
                _context.Locations.Add(location);
                await _context.SaveChangesAsync();

                // Return Ok to avoid circular reference issues with CreatedAtAction
                return Ok(location);
            }
            catch (Exception ex)
            {
                // Log and return 500 error if something goes wrong
                return StatusCode(500, new { message = "An error occurred while saving the location.", details = ex.Message });
            }
        }

        // PUT: api/Locations/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutLocation(int id, Location location)
        {
            if (id != location.LocationKey)
            {
                return BadRequest();
            }

            var existingLocation = await _context.Locations
                .Include(l => l.ChildLocations)
                .FirstOrDefaultAsync(l => l.LocationKey == id);

            if (existingLocation == null)
            {
                return NotFound();
            }

            // Check if hierarchy path changed
            bool pathChanged = existingLocation.LocationName != location.LocationName || 
                              existingLocation.ParentLocationKey != location.ParentLocationKey;

            existingLocation.LocationName = location.LocationName;
            existingLocation.LocationTypeKey = location.LocationTypeKey;
            existingLocation.ParentLocationKey = location.ParentLocationKey;
            
            if (pathChanged)
            {
                // Update children names if hierarchy changes
                existingLocation.FullName = await CalculateFullName(existingLocation);
                await UpdateChildrenFullNames(existingLocation);
            }

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!LocationExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // DELETE: api/Locations/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteLocation(int id)
        {
            var location = await _context.Locations
                .Include(l => l.ChildLocations)
                .Include(l => l.Equipments)
                .Include(l => l.Systems)
                .FirstOrDefaultAsync(l => l.LocationKey == id);

            if (location == null)
            {
                return NotFound();
            }

            // Prevent deletion if child locations exist
            if (location.ChildLocations.Any())
            {
                return BadRequest(new { message = "Cannot delete this location because it contains sub-locations (children). Please delete or move the sub-locations first." });
            }

            // Prevent deletion if equipment or systems are assigned
            if (location.Equipments.Any() || location.Systems.Any())
            {
                return BadRequest(new { message = "Cannot delete this location because it has equipment or systems assigned to it. Please remove them first." });
            }

            _context.Locations.Remove(location);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool LocationExists(int id)
        {
            return _context.Locations.Any(e => e.LocationKey == id);
        }

        // Helper method to build location hierarchy path string
        private async Task<string> CalculateFullName(Location location)
        {
            if (location.ParentLocationKey == null)
            {
                return location.LocationName;
            }

            var parent = await _context.Locations.FindAsync(location.ParentLocationKey);
            if (parent == null)
            {
                return location.LocationName;
            }

            return $"{parent.FullName}. {location.LocationName}";
        }

        // Recursive method to update names of all children when parent changes
        private async Task UpdateChildrenFullNames(Location parent)
        {
            var children = await _context.Locations
                .Where(l => l.ParentLocationKey == parent.LocationKey)
                .ToListAsync();

            foreach (var child in children)
            {
                child.FullName = $"{parent.FullName}. {child.LocationName}";
                await UpdateChildrenFullNames(child); 
            }
        }
    }
}