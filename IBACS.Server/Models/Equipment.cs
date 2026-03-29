using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace IBACS.Server.Models
{
    public class Equipment
    {
        [Key]
        public int EquipmentKey { get; set; }

        [ForeignKey(nameof(Location))]
        public int LocationKey { get; set; }
        public Location? Location { get; set; }

        [ForeignKey(nameof(EquipmentCategory))]
        public int EquipmentCategoryKey { get; set; }
        public EquipmentCategory? EquipmentCategory { get; set; }

        [Required]
        [StringLength(255)]
        public string Name { get; set; } = string.Empty;

        [StringLength(500)]
        public string? Description { get; set; }

        [ForeignKey(nameof(RTPage))]
        public int? RTPageKey { get; set; }
        public RTPage? RTPage { get; set; }

        // Navigation property
        public ICollection<Point> Points { get; set; } = new List<Point>();
    }
}
