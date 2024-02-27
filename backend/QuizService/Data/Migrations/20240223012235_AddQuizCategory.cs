using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace QuizService.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddQuizCategory : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Category",
                table: "Quizzes",
                type: "TEXT",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Category",
                table: "Quizzes");
        }
    }
}
