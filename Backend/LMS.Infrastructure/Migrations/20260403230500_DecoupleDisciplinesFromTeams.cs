using System;
using LMS.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LMS.Infrastructure.Migrations
{
    [DbContext(typeof(ApplicationDbContext))]
    [Migration("20260403230500_DecoupleDisciplinesFromTeams")]
    public partial class DecoupleDisciplinesFromTeams : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("""
                DO $$
                BEGIN
                    IF EXISTS (
                        SELECT 1
                        FROM information_schema.columns
                        WHERE table_schema = 'public'
                          AND table_name = 'Disciplines'
                          AND column_name = 'TeamId'
                    ) THEN
                        ALTER TABLE "Disciplines" DROP CONSTRAINT IF EXISTS "FK_Disciplines_Teams_TeamId";
                        DROP INDEX IF EXISTS "IX_Disciplines_TeamId";
                        ALTER TABLE "Disciplines" DROP COLUMN "TeamId";
                    END IF;
                END
                $$;
                """);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("""
                DO $$
                BEGIN
                    IF NOT EXISTS (
                        SELECT 1
                        FROM information_schema.columns
                        WHERE table_schema = 'public'
                          AND table_name = 'Disciplines'
                          AND column_name = 'TeamId'
                    ) THEN
                        ALTER TABLE "Disciplines" ADD COLUMN "TeamId" uuid NOT NULL DEFAULT '00000000-0000-0000-0000-000000000000';
                        CREATE INDEX "IX_Disciplines_TeamId" ON "Disciplines" ("TeamId");
                        ALTER TABLE "Disciplines"
                            ADD CONSTRAINT "FK_Disciplines_Teams_TeamId"
                            FOREIGN KEY ("TeamId") REFERENCES "Teams" ("Id")
                            ON DELETE RESTRICT;
                    END IF;
                END
                $$;
                """);
        }
    }
}
