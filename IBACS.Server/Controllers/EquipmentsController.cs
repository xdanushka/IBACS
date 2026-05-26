using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using IBACS.Server.Data;
using IBACS.Server.Models;

namespace IBACS.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EquipmentsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public EquipmentsController(AppDbContext context)
        {
            _context = context;
        }

        // 📝 API 01: සියලුම උපකරණ ලැයිස්තුව ලබාදීම (GET: api/Equipments)
        [HttpGet]
        public async Task<ActionResult<IEnumerable<object>>> GetEquipments()
        {
            return await _context.Equipments
                .Include(e => e.EquipmentCategory)
                .Include(e => e.Location)
                .Select(e => new {
                    EquipmentKey = e.EquipmentKey,
                    Name = e.Name,
                    Description = e.Description,
CategoryName = e.EquipmentCategory != null ? e.EquipmentCategory.ToString() : "Unknown",
                    LocationName = e.Location != null ? e.Location.LocationName : "Unknown"
                })
                .ToListAsync();
        }

        // 📝 API 02: අලුතින් උපකරණයක් ඇතුළත් කිරීම (POST: api/Equipments)
        [HttpPost]
        public async Task<ActionResult<Equipment>> PostEquipment(Equipment equipment)
        {
            _context.Equipments.Add(equipment);
            await _context.SaveChangesAsync();

            return Ok(equipment);
        }
    }
}
