using IBACS.Server.Data;
using IBACS.Server.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace IBACS.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PointsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public PointsController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Points
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Point>>> GetPoints()
        {
            return await _context.Points
                .Include(p => p.Equipment)
                .ToListAsync();
        }

        // GET: api/Points/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Point>> GetPoint(int id)
        {
            var point = await _context.Points
                .Include(p => p.Equipment)
                .FirstOrDefaultAsync(p => p.PointKey == id);

            if (point == null) return NotFound();
            return point;
        }

        // POST: api/Points
        [HttpPost]
        public async Task<ActionResult<Point>> PostPoint(Point point)
        {
            _context.Points.Add(point);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetPoint), new { id = point.PointKey }, point);
        }

        // PUT: api/Points/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutPoint(int id, Point point)
        {
            if (id != point.PointKey) return BadRequest();

            _context.Entry(point).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PointExists(id)) return NotFound();
                else throw;
            }

            return NoContent();
        }

        // DELETE: api/Points/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePoint(int id)
        {
            var point = await _context.Points.FindAsync(id);
            if (point == null) return NotFound();

            _context.Points.Remove(point);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool PointExists(int id)
        {
            return _context.Points.Any(p => p.PointKey == id);
        }
    }
}
