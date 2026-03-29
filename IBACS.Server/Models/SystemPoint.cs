using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace IBACS.Server.Models
{
    public class SystemPoint
    {
        [Key]
        public int SysPointKey { get; set; }

        [ForeignKey(nameof(Point))]
        public int PointKey { get; set; }
        public Point? Point { get; set; }

        [ForeignKey(nameof(SystemModel))]
        public int SystemKey { get; set; }
        public SystemModel? SystemModel { get; set; }
    }
}
