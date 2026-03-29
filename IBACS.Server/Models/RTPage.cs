using System.ComponentModel.DataAnnotations;

namespace IBACS.Server.Models
{
    public class RTPage
    {
        [Key]
        public int RTPageKey { get; set; }

        [Required]
        [StringLength(255)]
        public string PagePath { get; set; } = string.Empty;

        // Navigation property
        public ICollection<Equipment> Equipments { get; set; } = new List<Equipment>();
    }
}
