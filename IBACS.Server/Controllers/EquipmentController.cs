using IBACS.Server.Data;
using IBACS.Server.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace IBACS.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EquipmentController : ControllerBase
    {
        private readonly AppDbContext _context;

        public EquipmentController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Equipment
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Equipment>>> GetEquipments()
        {
            return await _context.Equipments
                .Include(e => e.Location)
                .Include(e => e.EquipmentCategory)
                .Include(e => e.RTPage)
                .ToListAsync();
        }

        // GET: api/Equipment/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Equipment>> GetEquipment(int id)
        {
            var equipment = await _context.Equipments
                .Include(e => e.Location)
                .Include(e => e.EquipmentCategory)
                .Include(e => e.RTPage)
                .Include(e => e.Points)
                .FirstOrDefaultAsync(e => e.EquipmentKey == id);

            if (equipment == null) return NotFound();
            return equipment;
        }

        // POST: api/Equipment
        [HttpPost]
        public async Task<ActionResult<Equipment>> PostEquipment(Equipment equipment)
        {
            _context.Equipments.Add(equipment);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetEquipment), new { id = equipment.EquipmentKey }, equipment);
        }

        // PUT: api/Equipment/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutEquipment(int id, Equipment equipment)
        {
            if (id != equipment.EquipmentKey) return BadRequest();

            _context.Entry(equipment).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!EquipmentExists(id)) return NotFound();
                else throw;
            }

            return NoContent();
        }

        // DELETE: api/Equipment/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteEquipment(int id)
        {
            var equipment = await _context.Equipments
                .Include(e => e.Points)
                .FirstOrDefaultAsync(e => e.EquipmentKey == id);

            if (equipment == null) return NotFound();

            // Validate: Prevent deletion if points are attached
            if (equipment.Points.Any())
            {
                return BadRequest(new { message = "Cannot delete equipment because it has associated points." });
            }

            _context.Equipments.Remove(equipment);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool EquipmentExists(int id)
        {
            return _context.Equipments.Any(e => e.EquipmentKey == id);
        }
    }
}