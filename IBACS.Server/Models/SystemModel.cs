using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace IBACS.Server.Models
{
    public class SystemModel
    {
        [Key]
        public int SystemKey { get; set; }

        [ForeignKey(nameof(Location))]
        public int LocationKey { get; set; }
        public Location? Location { get; set; }

        [Required]
        [StringLength(255)]
        public string Name { get; set; } = string.Empty;

        [StringLength(500)]
        public string? Description { get; set; }

        // Navigation property for many-to-many through SystemPoint
        public ICollection<SystemPoint> SystemPoints { get; set; } = new List<SystemPoint>();
    }
}
