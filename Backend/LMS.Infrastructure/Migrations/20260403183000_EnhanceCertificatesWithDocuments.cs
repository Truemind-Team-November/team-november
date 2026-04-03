using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LMS.Infrastructure.Migrations
{
    public partial class EnhanceCertificatesWithDocuments : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "CompletedAt",
                table: "Certificates",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "CourseTitleSnapshot",
                table: "Certificates",
                type: "character varying(200)",
                maxLength: 200,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "DocumentUrl",
                table: "Certificates",
                type: "character varying(1000)",
                maxLength: 1000,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "IssuedBy",
                table: "Certificates",
                type: "character varying(150)",
                maxLength: 150,
                nullable: false,
                defaultValue: "TalentFlow");

            migrationBuilder.AddColumn<string>(
                name: "RecipientCohortLabel",
                table: "Certificates",
                type: "character varying(50)",
                maxLength: 50,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "RecipientDiscipline",
                table: "Certificates",
                type: "character varying(100)",
                maxLength: 100,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "RecipientFullName",
                table: "Certificates",
                type: "character varying(200)",
                maxLength: 200,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "RecipientPublicId",
                table: "Certificates",
                type: "character varying(32)",
                maxLength: 32,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "TemplateVersion",
                table: "Certificates",
                type: "character varying(32)",
                maxLength: 32,
                nullable: false,
                defaultValue: "v1");

            migrationBuilder.Sql("""
                UPDATE "Certificates" AS c
                SET
                    "RecipientFullName" = TRIM(COALESCE(u."FirstName", '') || ' ' || COALESCE(u."LastName", '')),
                    "RecipientPublicId" = COALESCE(u."PublicId", ''),
                    "RecipientDiscipline" = COALESCE(NULLIF(TRIM(u."Discipline"), ''), 'Not assigned'),
                    "RecipientCohortLabel" = u."CohortLabel",
                    "CourseTitleSnapshot" = COALESCE(cr."Title", ''),
                    "CompletedAt" = c."IssuedAt",
                    "IssuedBy" = 'TalentFlow',
                    "TemplateVersion" = 'v1'
                FROM "Users" AS u
                INNER JOIN "Courses" AS cr ON cr."Id" = c."CourseId"
                WHERE u."Id" = c."UserId";
                """);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CompletedAt",
                table: "Certificates");

            migrationBuilder.DropColumn(
                name: "CourseTitleSnapshot",
                table: "Certificates");

            migrationBuilder.DropColumn(
                name: "DocumentUrl",
                table: "Certificates");

            migrationBuilder.DropColumn(
                name: "IssuedBy",
                table: "Certificates");

            migrationBuilder.DropColumn(
                name: "RecipientCohortLabel",
                table: "Certificates");

            migrationBuilder.DropColumn(
                name: "RecipientDiscipline",
                table: "Certificates");

            migrationBuilder.DropColumn(
                name: "RecipientFullName",
                table: "Certificates");

            migrationBuilder.DropColumn(
                name: "RecipientPublicId",
                table: "Certificates");

            migrationBuilder.DropColumn(
                name: "TemplateVersion",
                table: "Certificates");
        }
    }
}
