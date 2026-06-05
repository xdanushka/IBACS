using IBACS.Server.Data;
using IBACS.Server.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace IBACS.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SystemPointsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public SystemPointsController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/SystemPoints
        [HttpGet]
        public async Task<ActionResult<IEnumerable<SystemPoint>>> GetSystemPoints()
        {
            return await _context.SystemPoints
                .Include(sp => sp.Point)
                .Include(sp => sp.SystemModel)
                .ToListAsync();
        }

        // POST: api/SystemPoints
        [HttpPost]
        public async Task<ActionResult<SystemPoint>> PostSystemPoint(SystemPoint systemPoint)
        {
            // Validate system exists
            var systemExists = await _context.Systems.AnyAsync(s => s.SystemKey == systemPoint.SystemKey);
            if (!systemExists)
            {
                return BadRequest(new { message = $"System with key {systemPoint.SystemKey} does not exist." });
            }

            // Validate point exists
            var pointExists = await _context.Points.AnyAsync(p => p.PointKey == systemPoint.PointKey);
            if (!pointExists)
            {
                return BadRequest(new { message = $"Point with key {systemPoint.PointKey} does not exist." });
            }

            // Check if already exists
            var alreadyExists = await _context.SystemPoints.AnyAsync(sp => sp.SystemKey == systemPoint.SystemKey && sp.PointKey == systemPoint.PointKey);
            if (alreadyExists)
            {
                return BadRequest(new { message = "This point is already associated with the system." });
            }

            _context.SystemPoints.Add(systemPoint);
            await _context.SaveChangesAsync();

            // Load navigation properties to return complete object
            var created = await _context.SystemPoints
                .Include(sp => sp.Point)
                .FirstOrDefaultAsync(sp => sp.SysPointKey == systemPoint.SysPointKey);

            return Ok(created);
        }

        // DELETE: api/SystemPoints/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSystemPoint(int id)
        {
            var systemPoint = await _context.SystemPoints.FindAsync(id);
            if (systemPoint == null)
            {
                return NotFound();
            }

            _context.SystemPoints.Remove(systemPoint);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
