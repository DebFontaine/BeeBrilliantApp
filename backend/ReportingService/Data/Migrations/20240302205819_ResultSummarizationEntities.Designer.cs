﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using ReportingService;

#nullable disable

namespace ReportingService.Data.Migrations
{
    [DbContext(typeof(DataContext))]
    [Migration("20240302205819_ResultSummarizationEntities")]
    partial class ResultSummarizationEntities
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder.HasAnnotation("ProductVersion", "7.0.16");

            modelBuilder.Entity("ReportingService.AverageScore", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<string>("Average")
                        .HasColumnType("TEXT");

                    b.Property<string>("Category")
                        .HasColumnType("TEXT");

                    b.Property<DateTime>("DateTaken")
                        .HasColumnType("TEXT");

                    b.Property<int>("UserId")
                        .HasColumnType("INTEGER");

                    b.HasKey("Id");

                    b.ToTable("AverageScores");
                });

            modelBuilder.Entity("ReportingService.Awards", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<int>("Award")
                        .HasColumnType("INTEGER");

                    b.Property<string>("Category")
                        .HasColumnType("TEXT");

                    b.Property<DateTime>("DateAwarded")
                        .HasColumnType("TEXT");

                    b.Property<int>("Level")
                        .HasColumnType("INTEGER");

                    b.Property<int>("QuizId")
                        .HasColumnType("INTEGER");

                    b.Property<string>("QuizName")
                        .HasColumnType("TEXT");

                    b.Property<int>("UserId")
                        .HasColumnType("INTEGER");

                    b.HasKey("Id");

                    b.ToTable("Awards");
                });

            modelBuilder.Entity("ReportingService.Result", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<string>("Category")
                        .HasColumnType("TEXT");

                    b.Property<DateTime>("DateTaken")
                        .HasColumnType("TEXT");

                    b.Property<string>("Level")
                        .HasColumnType("TEXT");

                    b.Property<int>("QuizId")
                        .HasColumnType("INTEGER");

                    b.Property<string>("QuizName")
                        .HasColumnType("TEXT");

                    b.Property<string>("QuizResultStr")
                        .HasColumnType("TEXT");

                    b.Property<string>("Score")
                        .HasColumnType("TEXT");

                    b.Property<int>("UserId")
                        .HasColumnType("INTEGER");

                    b.Property<string>("Username")
                        .HasColumnType("TEXT");

                    b.HasKey("Id");

                    b.ToTable("Results");
                });

            modelBuilder.Entity("ReportingService.ResultSummary", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<string>("Category")
                        .HasColumnType("TEXT");

                    b.Property<DateTime>("DateTaken")
                        .HasColumnType("TEXT");

                    b.Property<string>("Level")
                        .HasColumnType("TEXT");

                    b.Property<int>("QuizId")
                        .HasColumnType("INTEGER");

                    b.Property<string>("QuizName")
                        .HasColumnType("TEXT");

                    b.Property<int>("ResultId")
                        .HasColumnType("INTEGER");

                    b.Property<string>("Score")
                        .HasColumnType("TEXT");

                    b.Property<int>("UserId")
                        .HasColumnType("INTEGER");

                    b.HasKey("Id");

                    b.ToTable("ResultSummaries");
                });
#pragma warning restore 612, 618
        }
    }
}
