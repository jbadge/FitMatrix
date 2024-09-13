using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FitMatrix.Migrations
{
    /// <inheritdoc />
    public partial class UpdatedStatsModelWithAge : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "age",
                table: "Stats",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "age",
                table: "Stats");
        }
    }
}
