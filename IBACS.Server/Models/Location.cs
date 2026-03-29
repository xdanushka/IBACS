using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace IBACS.Server.Models
{
    public class Location
    {
        [Key]
        public int LocationKey { get; set; }

        [Required]
        [StringLength(255)]
        public string LocationName { get; set; } = string.Empty;

        [ForeignKey(nameof(LocationType))]
        public int LocationTypeKey { get; set; }
        public LocationType? LocationType { get; set; }

        [StringLength(1000)]
        public string? FullName { get; set; }

        [ForeignKey(nameof(ParentLocation))]
        public int? ParentLocationKey { get; set; }
        public Location? ParentLocation { get; set; }

        // Navigation properties
        public ICollection<Location> ChildLocations { get; set; } = new List<Location>();
        public ICollection<Equipment> Equipments { get; set; } = new List<Equipment>();
        public ICollection<SystemModel> Systems { get; set; } = new List<SystemModel>();
    }
}
