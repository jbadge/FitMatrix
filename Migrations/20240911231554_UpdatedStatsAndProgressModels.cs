using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FitMatrix.Migrations
{
    /// <inheritdoc />
    public partial class UpdatedStatsAndProgressModels : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "StartingWeightMetric",
                table: "Stats",
                newName: "WeightMetric");

            migrationBuilder.RenameColumn(
                name: "StartingWeightImperial",
                table: "Stats",
                newName: "WeightImperial");

            migrationBuilder.RenameColumn(
                name: "StartingHeightMetric",
                table: "Stats",
                newName: "HeightMetric");

            migrationBuilder.RenameColumn(
                name: "StartingHeightImperial",
                table: "Stats",
                newName: "HeightImperial");

            migrationBuilder.RenameColumn(
                name: "WeightMetric",
                table: "Progress",
                newName: "ProgressWeightMetric");

            migrationBuilder.RenameColumn(
                name: "WeightImperial",
                table: "Progress",
                newName: "ProgressWeightImperial");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "WeightMetric",
                table: "Stats",
                newName: "StartingWeightMetric");

            migrationBuilder.RenameColumn(
                name: "WeightImperial",
                table: "Stats",
                newName: "StartingWeightImperial");

            migrationBuilder.RenameColumn(
                name: "HeightMetric",
                table: "Stats",
                newName: "StartingHeightMetric");

            migrationBuilder.RenameColumn(
                name: "HeightImperial",
                table: "Stats",
                newName: "StartingHeightImperial");

            migrationBuilder.RenameColumn(
                name: "ProgressWeightMetric",
                table: "Progress",
                newName: "WeightMetric");

            migrationBuilder.RenameColumn(
                name: "ProgressWeightImperial",
                table: "Progress",
                newName: "WeightImperial");
        }
    }
}
