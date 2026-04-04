using LMS.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LMS.Infrastructure.Migrations
{
    [DbContext(typeof(ApplicationDbContext))]
    [Migration("20260403195500_AddCertificateVerificationCode")]
    public partial class AddCertificateVerificationCode : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "VerificationCode",
                table: "Certificates",
                type: "character varying(64)",
                maxLength: 64,
                nullable: true);

            migrationBuilder.Sql("""
                WITH certificate_codes AS (
                    SELECT
                        "Id",
                        md5(random()::text || clock_timestamp()::text || "Id"::text) AS code
                    FROM "Certificates"
                )
                UPDATE "Certificates" AS c
                SET "VerificationCode" = lower(
                    substr(cc.code, 1, 8) || '-' ||
                    substr(cc.code, 9, 4) || '-' ||
                    substr(cc.code, 13, 4) || '-' ||
                    substr(cc.code, 17, 4) || '-' ||
                    substr(cc.code, 21, 12))
                FROM certificate_codes AS cc
                WHERE c."Id" = cc."Id"
                  AND c."VerificationCode" IS NULL;
                """);

            migrationBuilder.AlterColumn<string>(
                name: "VerificationCode",
                table: "Certificates",
                type: "character varying(64)",
                maxLength: 64,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(64)",
                oldMaxLength: 64,
                oldNullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Certificates_VerificationCode",
                table: "Certificates",
                column: "VerificationCode",
                unique: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Certificates_VerificationCode",
                table: "Certificates");

            migrationBuilder.DropColumn(
                name: "VerificationCode",
                table: "Certificates");
        }
    }
}
