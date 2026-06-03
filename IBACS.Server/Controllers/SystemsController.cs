using IBACS.Server.Data;
using IBACS.Server.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace IBACS.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SystemsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public SystemsController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/systems
        [HttpGet]
        public async Task<ActionResult<IEnumerable<SystemModel>>> GetSystems()
        {
            return await _context.Systems
                .Include(s => s.Location)
                .OrderBy(s => s.Name)
                .ToListAsync();
        }

        // GET: api/systems/5
        [HttpGet("{id}")]
        public async Task<ActionResult<SystemModel>> GetSystem(int id)
        {
            var system = await _context.Systems
                .Include(s => s.Location)
                .Include(s => s.SystemPoints)
                    .ThenInclude(sp => sp.Point)
                .FirstOrDefaultAsync(s => s.SystemKey == id);

            if (system == null)
            {
                return NotFound();
            }

            return system;
        }

        // POST: api/systems
        [HttpPost]
        public async Task<ActionResult<SystemModel>> PostSystem(SystemModel system)
        {
            // Validate that Location exists
            var locationExists = await _context.Locations.AnyAsync(l => l.LocationKey == system.LocationKey);
            if (!locationExists)
            {
                return BadRequest(new { message = $"Location with key {system.LocationKey} does not exist." });
            }

            _context.Systems.Add(system);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetSystem), new { id = system.SystemKey }, system);
        }

        // PUT: api/systems/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutSystem(int id, SystemModel system)
        {
            if (id != system.SystemKey)
            {
                return BadRequest();
            }

            var existingSystem = await _context.Systems.FindAsync(id);
            if (existingSystem == null)
            {
                return NotFound();
            }

            // Validate location exists if LocationKey is being updated
            if (existingSystem.LocationKey != system.LocationKey)
            {
                var locationExists = await _context.Locations.AnyAsync(l => l.LocationKey == system.LocationKey);
                if (!locationExists)
                {
                    return BadRequest(new { message = $"Location with key {system.LocationKey} does not exist." });
                }
            }

            existingSystem.Name = system.Name;
            existingSystem.Description = system.Description;
            existingSystem.LocationKey = system.LocationKey;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!SystemExists(id))
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

        // DELETE: api/systems/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSystem(int id)
        {
            var system = await _context.Systems.FindAsync(id);
            if (system == null)
            {
                return NotFound();
            }

            _context.Systems.Remove(system);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool SystemExists(int id)
        {
            return _context.Systems.Any(e => e.SystemKey == id);
        }
    }
}
