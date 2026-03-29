using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace IBACS.Server.Models
{
    public class Point
    {
        [Key]
        public int PointKey { get; set; }

        [ForeignKey(nameof(Equipment))]
        public int EquipmentKey { get; set; }
        public Equipment? Equipment { get; set; }

        [Required]
        [StringLength(255)]
        public string Name { get; set; } = string.Empty;

        [StringLength(500)]
        public string? Address { get; set; }

        // Navigation property for many-to-many through SystemPoint
        public ICollection<SystemPoint> SystemPoints { get; set; } = new List<SystemPoint>();
    }
}
