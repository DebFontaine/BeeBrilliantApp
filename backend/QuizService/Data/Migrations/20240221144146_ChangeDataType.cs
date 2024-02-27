using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace QuizService.Data.Migrations
{
    /// <inheritdoc />
    public partial class ChangeDataType : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Data",
                table: "Questions",
                newName: "ExtendedData");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "ExtendedData",
                table: "Questions",
                newName: "Data");
        }
    }
}
