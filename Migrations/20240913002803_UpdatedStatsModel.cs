using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FitMatrix.Migrations
{
    /// <inheritdoc />
    public partial class UpdatedStatsModel : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ActivityLevelLabel",
                table: "Stats",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ActivityLevelLabel",
                table: "Stats");
        }
    }
}
