using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FitMatrix.Migrations
{
    /// <inheritdoc />
    public partial class AddedGoalMetricAndImperial : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "GoalWeight",
                table: "Goal",
                newName: "GoalWeightLoseMetric");

            migrationBuilder.RenameColumn(
                name: "GoalRate",
                table: "Goal",
                newName: "GoalWeightLoseImperial");

            migrationBuilder.AddColumn<double>(
                name: "GoalRateGainImperial",
                table: "Goal",
                type: "double precision",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<double>(
                name: "GoalRateGainMetric",
                table: "Goal",
                type: "double precision",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<double>(
                name: "GoalRateLoseImperial",
                table: "Goal",
                type: "double precision",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<double>(
                name: "GoalRateLoseMetric",
                table: "Goal",
                type: "double precision",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<double>(
                name: "GoalWeightGainImperial",
                table: "Goal",
                type: "double precision",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<double>(
                name: "GoalWeightGainMetric",
                table: "Goal",
                type: "double precision",
                nullable: false,
                defaultValue: 0.0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "GoalRateGainImperial",
                table: "Goal");

            migrationBuilder.DropColumn(
                name: "GoalRateGainMetric",
                table: "Goal");

            migrationBuilder.DropColumn(
                name: "GoalRateLoseImperial",
                table: "Goal");

            migrationBuilder.DropColumn(
                name: "GoalRateLoseMetric",
                table: "Goal");

            migrationBuilder.DropColumn(
                name: "GoalWeightGainImperial",
                table: "Goal");

            migrationBuilder.DropColumn(
                name: "GoalWeightGainMetric",
                table: "Goal");

            migrationBuilder.RenameColumn(
                name: "GoalWeightLoseMetric",
                table: "Goal",
                newName: "GoalWeight");

            migrationBuilder.RenameColumn(
                name: "GoalWeightLoseImperial",
                table: "Goal",
                newName: "GoalRate");
        }
    }
}
