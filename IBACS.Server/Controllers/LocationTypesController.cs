using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using IBACS.Server.Data;
using IBACS.Server.Models;

namespace IBACS.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
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
            return await _context.LocationTypes.ToListAsync();
        }

        // POST: api/LocationTypes
        [HttpPost]
        public async Task<ActionResult<LocationType>> PostLocationType(LocationType locationType)
        {
            _context.LocationTypes.Add(locationType);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetLocationTypes), new { id = locationType.LocationTypeKey }, locationType);
        }
    }
}
