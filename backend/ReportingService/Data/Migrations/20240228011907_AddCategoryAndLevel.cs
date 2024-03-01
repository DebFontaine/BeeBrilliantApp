using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ReportingService.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddCategoryAndLevel : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Category",
                table: "Results",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Level",
                table: "Results",
                type: "TEXT",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Category",
                table: "Results");

            migrationBuilder.DropColumn(
                name: "Level",
                table: "Results");
        }
    }
}
