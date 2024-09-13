using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FitMatrix.Migrations
{
    /// <inheritdoc />
    public partial class UpdatedStatsModelWithAllVariablesAge : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "age",
                table: "Stats",
                newName: "Age");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Age",
                table: "Stats",
                newName: "age");
        }
    }
}
