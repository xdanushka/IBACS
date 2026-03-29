using IBACS.Server.Data;
using IBACS.Server.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace IBACS.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LocationTypesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public LocationTypesController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/LocationTypes
        [HttpGet]
        public async Task<ActionResult<IEnumerable<LocationType>>> GetLocationTypes()
        {
            return await _context.LocationTypes.OrderBy(lt => lt.Name).ToListAsync();
        }

        // GET: api/LocationTypes/5
        [HttpGet("{id}")]
        public async Task<ActionResult<LocationType>> GetLocationType(int id)
        {
            var locationType = await _context.LocationTypes.FindAsync(id);

            if (locationType == null)
            {
                return NotFound();
            }

            return locationType;
        }

        // POST: api/LocationTypes
        [HttpPost]
        public async Task<ActionResult<LocationType>> PostLocationType(LocationType locationType)
        {
            if (LocationTypeExistsByName(locationType.Name))
            {
                return Conflict(new { message = "A location type with this name already exists (case-insensitive)." });
            }

            _context.LocationTypes.Add(locationType);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetLocationType), new { id = locationType.LocationTypeKey }, locationType);
        }

        // DELETE: api/LocationTypes/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteLocationType(int id)
        {
            var locationType = await _context.LocationTypes.FindAsync(id);
            if (locationType == null)
            {
                return NotFound();
            }

            // Check if any locations are using this type
            var inUse = await _context.Locations.AnyAsync(l => l.LocationTypeKey == id);
            if (inUse)
            {
                return BadRequest(new { message = "Cannot delete location type because it is in use by one or more locations." });
            }

            _context.LocationTypes.Remove(locationType);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool LocationTypeExistsByName(string name)
        {
            return _context.LocationTypes.Any(e => e.Name.ToLower() == name.ToLower());
        }
    }
}
