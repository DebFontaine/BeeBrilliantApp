using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json.Linq;

namespace QuizService;

public class DataContext : DbContext
{
    public DataContext(DbContextOptions options) : base(options)
    {

    }
    public DbSet<Quiz> Quizzes { get; set; }
    public DbSet<Question> Questions { get; set; }
    public DbSet<QuizQuestion> QuizQuestions { get; set; } // DbSet for the join entity

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<QuizQuestion>()
            .HasKey(qq => new { qq.QuizId, qq.QuestionId }); // Composite primary key

        modelBuilder.Entity<QuizQuestion>()
            .HasOne(qq => qq.Quiz)
            .WithMany(q => q.QuizQuestions)
            .HasForeignKey(qq => qq.QuizId);

        modelBuilder.Entity<QuizQuestion>()
            .HasOne(qq => qq.Question)
            .WithMany(q => q.QuizQuestions)
            .HasForeignKey(qq => qq.QuestionId);

         modelBuilder.Entity<Question>()
            .Property<string>("ExtendedData")
            .HasField("ExtendedData");
        /*  modelBuilder.Entity<Question>()
             .Property(qr => qr.Data)
             .HasColumnType("TEXT"); // Store as text */

    }
}
