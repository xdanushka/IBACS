using IBACS.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace IBACS.Server.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<Location> Locations { get; set; }
        public DbSet<LocationType> LocationTypes { get; set; }
        public DbSet<SystemModel> Systems { get; set; }
        public DbSet<Equipment> Equipments { get; set; }
        public DbSet<EquipmentCategory> EquipmentCategories { get; set; }
        public DbSet<RTPage> RTPages { get; set; }
        public DbSet<Point> Points { get; set; }
        public DbSet<SystemPoint> SystemPoints { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure recursive relationship for Location
            modelBuilder.Entity<Location>()
                .HasOne(l => l.ParentLocation)
                .WithMany(l => l.ChildLocations)
                .HasForeignKey(l => l.ParentLocationKey)
                .OnDelete(DeleteBehavior.Restrict);

            // Configure unique index for LocationType Name
            modelBuilder.Entity<LocationType>()
                .HasIndex(lt => lt.Name)
                .IsUnique();

            // Configure Many-to-Many relationship (Explicit Join Table)
            modelBuilder.Entity<SystemPoint>()
                .HasOne(sp => sp.SystemModel)
                .WithMany(s => s.SystemPoints)
                .HasForeignKey(sp => sp.SystemKey);

            modelBuilder.Entity<SystemPoint>()
                .HasOne(sp => sp.Point)
                .WithMany(p => p.SystemPoints)
                .HasForeignKey(sp => sp.PointKey);
        }
    }
}
