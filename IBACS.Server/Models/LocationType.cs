using System.ComponentModel.DataAnnotations;

namespace IBACS.Server.Models
{
    public class LocationType
    {
        [Key]
        public int LocationTypeKey { get; set; }

        [Required]
        [StringLength(100)]
        public string Name { get; set; } = string.Empty;

        // Navigation property
        public ICollection<Location> Locations { get; set; } = new List<Location>();
    }
}
