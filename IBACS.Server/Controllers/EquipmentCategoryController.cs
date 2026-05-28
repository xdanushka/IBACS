using IBACS.Server.Data;
using IBACS.Server.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace IBACS.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EquipmentCategoryController : ControllerBase
    {
        private readonly AppDbContext _context;

        public EquipmentCategoryController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<EquipmentCategory>>> GetCategories()
        {
            return await _context.EquipmentCategories.ToListAsync();
        }

        [HttpPost]
        public async Task<ActionResult<EquipmentCategory>> PostCategory(EquipmentCategory category)
        {
            _context.EquipmentCategories.Add(category);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetCategories), new { id = category.EquipmentCategoryKey }, category);
        }
    }
}