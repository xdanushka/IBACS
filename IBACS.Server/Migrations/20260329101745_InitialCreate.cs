using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace IBACS.Server.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "EquipmentCategories",
                columns: table => new
                {
                    EquipmentCategoryKey = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Category = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EquipmentCategories", x => x.EquipmentCategoryKey);
                });

            migrationBuilder.CreateTable(
                name: "LocationTypes",
                columns: table => new
                {
                    LocationTypeKey = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LocationTypes", x => x.LocationTypeKey);
                });

            migrationBuilder.CreateTable(
                name: "RTPages",
                columns: table => new
                {
                    RTPageKey = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    PagePath = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RTPages", x => x.RTPageKey);
                });

            migrationBuilder.CreateTable(
                name: "Locations",
                columns: table => new
                {
                    LocationKey = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    LocationName = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    LocationTypeKey = table.Column<int>(type: "integer", nullable: false),
                    FullName = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: true),
                    ParentLocationKey = table.Column<int>(type: "integer", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Locations", x => x.LocationKey);
                    table.ForeignKey(
                        name: "FK_Locations_LocationTypes_LocationTypeKey",
                        column: x => x.LocationTypeKey,
                        principalTable: "LocationTypes",
                        principalColumn: "LocationTypeKey",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Locations_Locations_ParentLocationKey",
                        column: x => x.ParentLocationKey,
                        principalTable: "Locations",
                        principalColumn: "LocationKey",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Equipments",
                columns: table => new
                {
                    EquipmentKey = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    LocationKey = table.Column<int>(type: "integer", nullable: false),
                    EquipmentCategoryKey = table.Column<int>(type: "integer", nullable: false),
                    Name = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    Description = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    RTPageKey = table.Column<int>(type: "integer", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Equipments", x => x.EquipmentKey);
                    table.ForeignKey(
                        name: "FK_Equipments_EquipmentCategories_EquipmentCategoryKey",
                        column: x => x.EquipmentCategoryKey,
                        principalTable: "EquipmentCategories",
                        principalColumn: "EquipmentCategoryKey",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Equipments_Locations_LocationKey",
                        column: x => x.LocationKey,
                        principalTable: "Locations",
                        principalColumn: "LocationKey",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Equipments_RTPages_RTPageKey",
                        column: x => x.RTPageKey,
                        principalTable: "RTPages",
                        principalColumn: "RTPageKey");
                });

            migrationBuilder.CreateTable(
                name: "Systems",
                columns: table => new
                {
                    SystemKey = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    LocationKey = table.Column<int>(type: "integer", nullable: false),
                    Name = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    Description = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Systems", x => x.SystemKey);
                    table.ForeignKey(
                        name: "FK_Systems_Locations_LocationKey",
                        column: x => x.LocationKey,
                        principalTable: "Locations",
                        principalColumn: "LocationKey",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Points",
                columns: table => new
                {
                    PointKey = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    EquipmentKey = table.Column<int>(type: "integer", nullable: false),
                    Name = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    Address = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Points", x => x.PointKey);
                    table.ForeignKey(
                        name: "FK_Points_Equipments_EquipmentKey",
                        column: x => x.EquipmentKey,
                        principalTable: "Equipments",
                        principalColumn: "EquipmentKey",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "SystemPoints",
                columns: table => new
                {
                    SysPointKey = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    PointKey = table.Column<int>(type: "integer", nullable: false),
                    SystemKey = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SystemPoints", x => x.SysPointKey);
                    table.ForeignKey(
                        name: "FK_SystemPoints_Points_PointKey",
                        column: x => x.PointKey,
                        principalTable: "Points",
                        principalColumn: "PointKey",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_SystemPoints_Systems_SystemKey",
                        column: x => x.SystemKey,
                        principalTable: "Systems",
                        principalColumn: "SystemKey",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Equipments_EquipmentCategoryKey",
                table: "Equipments",
                column: "EquipmentCategoryKey");

            migrationBuilder.CreateIndex(
                name: "IX_Equipments_LocationKey",
                table: "Equipments",
                column: "LocationKey");

            migrationBuilder.CreateIndex(
                name: "IX_Equipments_RTPageKey",
                table: "Equipments",
                column: "RTPageKey");

            migrationBuilder.CreateIndex(
                name: "IX_Locations_LocationTypeKey",
                table: "Locations",
                column: "LocationTypeKey");

            migrationBuilder.CreateIndex(
                name: "IX_Locations_ParentLocationKey",
                table: "Locations",
                column: "ParentLocationKey");

            migrationBuilder.CreateIndex(
                name: "IX_Points_EquipmentKey",
                table: "Points",
                column: "EquipmentKey");

            migrationBuilder.CreateIndex(
                name: "IX_SystemPoints_PointKey",
                table: "SystemPoints",
                column: "PointKey");

            migrationBuilder.CreateIndex(
                name: "IX_SystemPoints_SystemKey",
                table: "SystemPoints",
                column: "SystemKey");

            migrationBuilder.CreateIndex(
                name: "IX_Systems_LocationKey",
                table: "Systems",
                column: "LocationKey");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "SystemPoints");

            migrationBuilder.DropTable(
                name: "Points");

            migrationBuilder.DropTable(
                name: "Systems");

            migrationBuilder.DropTable(
                name: "Equipments");

            migrationBuilder.DropTable(
                name: "EquipmentCategories");

            migrationBuilder.DropTable(
                name: "Locations");

            migrationBuilder.DropTable(
                name: "RTPages");

            migrationBuilder.DropTable(
                name: "LocationTypes");
        }
    }
}
