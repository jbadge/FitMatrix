using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FitMatrix.Migrations
{
    /// <inheritdoc />
    public partial class UpdatedModelsFixedProgress : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Sex",
                table: "Progress");

            migrationBuilder.RenameColumn(
                name: "StartingWeight",
                table: "Progress",
                newName: "WeightMetric");

            migrationBuilder.RenameColumn(
                name: "Height",
                table: "Progress",
                newName: "WeightImperial");

            migrationBuilder.RenameColumn(
                name: "DoB",
                table: "Progress",
                newName: "DoE");

            migrationBuilder.RenameColumn(
                name: "ActivityLevel",
                table: "Progress",
                newName: "Calories");

            migrationBuilder.AddColumn<int>(
                name: "BodyFatPercent",
                table: "Progress",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "BodyFatPercent",
                table: "Progress");

            migrationBuilder.RenameColumn(
                name: "WeightMetric",
                table: "Progress",
                newName: "StartingWeight");

            migrationBuilder.RenameColumn(
                name: "WeightImperial",
                table: "Progress",
                newName: "Height");

            migrationBuilder.RenameColumn(
                name: "DoE",
                table: "Progress",
                newName: "DoB");

            migrationBuilder.RenameColumn(
                name: "Calories",
                table: "Progress",
                newName: "ActivityLevel");

            migrationBuilder.AddColumn<string>(
                name: "Sex",
                table: "Progress",
                type: "text",
                nullable: true);
        }
    }
}
