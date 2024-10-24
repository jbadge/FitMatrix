using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FitMatrix.Migrations
{
    /// <inheritdoc />
    public partial class FixesMeasurementsClassProperties : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Wrist",
                table: "Measurements",
                newName: "WaistMetric");

            migrationBuilder.RenameColumn(
                name: "Waist",
                table: "Measurements",
                newName: "WaistImperial");

            migrationBuilder.RenameColumn(
                name: "Shoulders",
                table: "Measurements",
                newName: "ShouldersMetric");

            migrationBuilder.RenameColumn(
                name: "RightThigh",
                table: "Measurements",
                newName: "ShouldersImperial");

            migrationBuilder.RenameColumn(
                name: "RightForearm",
                table: "Measurements",
                newName: "RightWristMetric");

            migrationBuilder.RenameColumn(
                name: "RightCalf",
                table: "Measurements",
                newName: "RightWristImperial");

            migrationBuilder.RenameColumn(
                name: "RightBicep",
                table: "Measurements",
                newName: "RightThighMetric");

            migrationBuilder.RenameColumn(
                name: "Neck",
                table: "Measurements",
                newName: "RightThighImperial");

            migrationBuilder.RenameColumn(
                name: "Naval",
                table: "Measurements",
                newName: "RightForearmMetric");

            migrationBuilder.RenameColumn(
                name: "LeftThigh",
                table: "Measurements",
                newName: "RightForearmImperial");

            migrationBuilder.RenameColumn(
                name: "LeftForearm",
                table: "Measurements",
                newName: "RightCalfMetric");

            migrationBuilder.RenameColumn(
                name: "LeftCalf",
                table: "Measurements",
                newName: "RightCalfImperial");

            migrationBuilder.RenameColumn(
                name: "LeftBicep",
                table: "Measurements",
                newName: "RightBicepMetric");

            migrationBuilder.RenameColumn(
                name: "Hip",
                table: "Measurements",
                newName: "RightBicepImperial");

            migrationBuilder.RenameColumn(
                name: "Chest",
                table: "Measurements",
                newName: "RightAnkleMetric");

            migrationBuilder.RenameColumn(
                name: "Ankle",
                table: "Measurements",
                newName: "RightAnkleImperial");

            migrationBuilder.AddColumn<double>(
                name: "ChestImperial",
                table: "Measurements",
                type: "double precision",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<double>(
                name: "ChestMetric",
                table: "Measurements",
                type: "double precision",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<double>(
                name: "HipsImperial",
                table: "Measurements",
                type: "double precision",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<double>(
                name: "HipsMetric",
                table: "Measurements",
                type: "double precision",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<double>(
                name: "LeftAnkleImperial",
                table: "Measurements",
                type: "double precision",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<double>(
                name: "LeftAnkleMetric",
                table: "Measurements",
                type: "double precision",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<double>(
                name: "LeftBicepImperial",
                table: "Measurements",
                type: "double precision",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<double>(
                name: "LeftBicepMetric",
                table: "Measurements",
                type: "double precision",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<double>(
                name: "LeftCalfImperial",
                table: "Measurements",
                type: "double precision",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<double>(
                name: "LeftCalfMetric",
                table: "Measurements",
                type: "double precision",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<double>(
                name: "LeftForearmImperial",
                table: "Measurements",
                type: "double precision",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<double>(
                name: "LeftForearmMetric",
                table: "Measurements",
                type: "double precision",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<double>(
                name: "LeftThighImperial",
                table: "Measurements",
                type: "double precision",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<double>(
                name: "LeftThighMetric",
                table: "Measurements",
                type: "double precision",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<double>(
                name: "LeftWristImperial",
                table: "Measurements",
                type: "double precision",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<double>(
                name: "LeftWristMetric",
                table: "Measurements",
                type: "double precision",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<double>(
                name: "NavelImperial",
                table: "Measurements",
                type: "double precision",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<double>(
                name: "NavelMetric",
                table: "Measurements",
                type: "double precision",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<double>(
                name: "NeckImperial",
                table: "Measurements",
                type: "double precision",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<double>(
                name: "NeckMetric",
                table: "Measurements",
                type: "double precision",
                nullable: false,
                defaultValue: 0.0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ChestImperial",
                table: "Measurements");

            migrationBuilder.DropColumn(
                name: "ChestMetric",
                table: "Measurements");

            migrationBuilder.DropColumn(
                name: "HipsImperial",
                table: "Measurements");

            migrationBuilder.DropColumn(
                name: "HipsMetric",
                table: "Measurements");

            migrationBuilder.DropColumn(
                name: "LeftAnkleImperial",
                table: "Measurements");

            migrationBuilder.DropColumn(
                name: "LeftAnkleMetric",
                table: "Measurements");

            migrationBuilder.DropColumn(
                name: "LeftBicepImperial",
                table: "Measurements");

            migrationBuilder.DropColumn(
                name: "LeftBicepMetric",
                table: "Measurements");

            migrationBuilder.DropColumn(
                name: "LeftCalfImperial",
                table: "Measurements");

            migrationBuilder.DropColumn(
                name: "LeftCalfMetric",
                table: "Measurements");

            migrationBuilder.DropColumn(
                name: "LeftForearmImperial",
                table: "Measurements");

            migrationBuilder.DropColumn(
                name: "LeftForearmMetric",
                table: "Measurements");

            migrationBuilder.DropColumn(
                name: "LeftThighImperial",
                table: "Measurements");

            migrationBuilder.DropColumn(
                name: "LeftThighMetric",
                table: "Measurements");

            migrationBuilder.DropColumn(
                name: "LeftWristImperial",
                table: "Measurements");

            migrationBuilder.DropColumn(
                name: "LeftWristMetric",
                table: "Measurements");

            migrationBuilder.DropColumn(
                name: "NavelImperial",
                table: "Measurements");

            migrationBuilder.DropColumn(
                name: "NavelMetric",
                table: "Measurements");

            migrationBuilder.DropColumn(
                name: "NeckImperial",
                table: "Measurements");

            migrationBuilder.DropColumn(
                name: "NeckMetric",
                table: "Measurements");

            migrationBuilder.RenameColumn(
                name: "WaistMetric",
                table: "Measurements",
                newName: "Wrist");

            migrationBuilder.RenameColumn(
                name: "WaistImperial",
                table: "Measurements",
                newName: "Waist");

            migrationBuilder.RenameColumn(
                name: "ShouldersMetric",
                table: "Measurements",
                newName: "Shoulders");

            migrationBuilder.RenameColumn(
                name: "ShouldersImperial",
                table: "Measurements",
                newName: "RightThigh");

            migrationBuilder.RenameColumn(
                name: "RightWristMetric",
                table: "Measurements",
                newName: "RightForearm");

            migrationBuilder.RenameColumn(
                name: "RightWristImperial",
                table: "Measurements",
                newName: "RightCalf");

            migrationBuilder.RenameColumn(
                name: "RightThighMetric",
                table: "Measurements",
                newName: "RightBicep");

            migrationBuilder.RenameColumn(
                name: "RightThighImperial",
                table: "Measurements",
                newName: "Neck");

            migrationBuilder.RenameColumn(
                name: "RightForearmMetric",
                table: "Measurements",
                newName: "Naval");

            migrationBuilder.RenameColumn(
                name: "RightForearmImperial",
                table: "Measurements",
                newName: "LeftThigh");

            migrationBuilder.RenameColumn(
                name: "RightCalfMetric",
                table: "Measurements",
                newName: "LeftForearm");

            migrationBuilder.RenameColumn(
                name: "RightCalfImperial",
                table: "Measurements",
                newName: "LeftCalf");

            migrationBuilder.RenameColumn(
                name: "RightBicepMetric",
                table: "Measurements",
                newName: "LeftBicep");

            migrationBuilder.RenameColumn(
                name: "RightBicepImperial",
                table: "Measurements",
                newName: "Hip");

            migrationBuilder.RenameColumn(
                name: "RightAnkleMetric",
                table: "Measurements",
                newName: "Chest");

            migrationBuilder.RenameColumn(
                name: "RightAnkleImperial",
                table: "Measurements",
                newName: "Ankle");
        }
    }
}
