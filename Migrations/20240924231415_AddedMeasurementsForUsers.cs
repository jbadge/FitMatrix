using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace FitMatrix.Migrations
{
    /// <inheritdoc />
    public partial class AddedMeasurementsForUsers : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Measurements",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Neck = table.Column<double>(type: "double precision", nullable: false),
                    Chest = table.Column<double>(type: "double precision", nullable: false),
                    Shoulders = table.Column<double>(type: "double precision", nullable: false),
                    RightBicep = table.Column<double>(type: "double precision", nullable: false),
                    LeftBicep = table.Column<double>(type: "double precision", nullable: false),
                    RightForearm = table.Column<double>(type: "double precision", nullable: false),
                    LeftForearm = table.Column<double>(type: "double precision", nullable: false),
                    Waist = table.Column<double>(type: "double precision", nullable: false),
                    Naval = table.Column<double>(type: "double precision", nullable: false),
                    Hip = table.Column<double>(type: "double precision", nullable: false),
                    RightThigh = table.Column<double>(type: "double precision", nullable: false),
                    LeftThigh = table.Column<double>(type: "double precision", nullable: false),
                    RightCalf = table.Column<double>(type: "double precision", nullable: false),
                    LeftCalf = table.Column<double>(type: "double precision", nullable: false),
                    Wrist = table.Column<double>(type: "double precision", nullable: false),
                    Ankle = table.Column<double>(type: "double precision", nullable: false),
                    UserId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Measurements", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Measurements_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Measurements_UserId",
                table: "Measurements",
                column: "UserId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Measurements");
        }
    }
}
