using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FitMatrix.Migrations
{
    /// <inheritdoc />
    public partial class UpdatedStatsModelWithAllVariables : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "StartingWeight",
                table: "Stats",
                newName: "StartingWeightMetric");

            migrationBuilder.RenameColumn(
                name: "Height",
                table: "Stats",
                newName: "StartingWeightImperial");

            migrationBuilder.AddColumn<double>(
                name: "StartingHeightImperial",
                table: "Stats",
                type: "double precision",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<double>(
                name: "StartingHeightMetric",
                table: "Stats",
                type: "double precision",
                nullable: false,
                defaultValue: 0.0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "StartingHeightImperial",
                table: "Stats");

            migrationBuilder.DropColumn(
                name: "StartingHeightMetric",
                table: "Stats");

            migrationBuilder.RenameColumn(
                name: "StartingWeightMetric",
                table: "Stats",
                newName: "StartingWeight");

            migrationBuilder.RenameColumn(
                name: "StartingWeightImperial",
                table: "Stats",
                newName: "Height");
        }
    }
}
