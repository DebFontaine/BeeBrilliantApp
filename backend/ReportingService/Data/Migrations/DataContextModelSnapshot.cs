﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using ReportingService;

#nullable disable

namespace ReportingService.Data.Migrations
{
    [DbContext(typeof(DataContext))]
    partial class DataContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "7.0.16")
                .HasAnnotation("Relational:MaxIdentifierLength", 64);

            modelBuilder.Entity("ReportingService.AverageScore", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    b.Property<string>("Average")
                        .HasColumnType("longtext");

                    b.Property<string>("Category")
                        .HasColumnType("longtext");

                    b.Property<DateTime>("DateTaken")
                        .HasColumnType("datetime(6)");

                    b.Property<int>("UserId")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.ToTable("AverageScores");
                });

            modelBuilder.Entity("ReportingService.Awards", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    b.Property<int>("Award")
                        .HasColumnType("int");

                    b.Property<string>("Category")
                        .HasColumnType("longtext");

                    b.Property<DateTime>("DateAwarded")
                        .HasColumnType("datetime(6)");

                    b.Property<string>("Level")
                        .HasColumnType("longtext");

                    b.Property<int>("QuizId")
                        .HasColumnType("int");

                    b.Property<string>("QuizName")
                        .HasColumnType("longtext");

                    b.Property<int>("UserId")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.ToTable("Awards");
                });

            modelBuilder.Entity("ReportingService.Result", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    b.Property<string>("Category")
                        .HasColumnType("longtext");

                    b.Property<DateTime>("DateTaken")
                        .HasColumnType("datetime(6)");

                    b.Property<string>("Level")
                        .HasColumnType("longtext");

                    b.Property<int>("QuizId")
                        .HasColumnType("int");

                    b.Property<string>("QuizName")
                        .HasColumnType("longtext");

                    b.Property<string>("QuizResultStr")
                        .HasColumnType("longtext");

                    b.Property<string>("Score")
                        .HasColumnType("longtext");

                    b.Property<int>("UserId")
                        .HasColumnType("int");

                    b.Property<string>("Username")
                        .HasColumnType("longtext");

                    b.HasKey("Id");

                    b.ToTable("Results");
                });

            modelBuilder.Entity("ReportingService.ResultSummary", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    b.Property<string>("Category")
                        .HasColumnType("longtext");

                    b.Property<DateTime>("DateTaken")
                        .HasColumnType("datetime(6)");

                    b.Property<string>("Level")
                        .HasColumnType("longtext");

                    b.Property<int>("QuizId")
                        .HasColumnType("int");

                    b.Property<string>("QuizName")
                        .HasColumnType("longtext");

                    b.Property<int>("ResultId")
                        .HasColumnType("int");

                    b.Property<string>("Score")
                        .HasColumnType("longtext");

                    b.Property<int>("UserId")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.ToTable("ResultSummaries");
                });
#pragma warning restore 612, 618
        }
    }
}
