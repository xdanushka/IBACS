using System.ComponentModel.DataAnnotations;

namespace IBACS.Server.Models
{
    public class EquipmentCategory
    {
        [Key]
        public int EquipmentCategoryKey { get; set; }

        [Required]
        [StringLength(100)]
        public string Category { get; set; } = string.Empty;

        // Navigation property
        public ICollection<Equipment> Equipments { get; set; } = new List<Equipment>();
    }
}
