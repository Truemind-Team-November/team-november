using System;
using LMS.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LMS.Infrastructure.Migrations
{
    [DbContext(typeof(ApplicationDbContext))]
    [Migration("20260403183000_EnhanceCertificatesWithDocuments")]
    public partial class EnhanceCertificatesWithDocuments : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Add certificate columns only if they don't already exist to avoid
            // migration failures on databases where previous migrations or manual
            // schema changes added the columns.
            migrationBuilder.Sql("""
                DO $$
                BEGIN
                    IF NOT EXISTS (
                        SELECT 1
                        FROM information_schema.columns
                        WHERE table_schema = 'public'
                          AND table_name = 'Certificates'
                          AND column_name = 'CompletedAt'
                    ) THEN
                        ALTER TABLE "Certificates" ADD COLUMN "CompletedAt" timestamp with time zone;
                    END IF;

                    IF NOT EXISTS (
                        SELECT 1
                        FROM information_schema.columns
                        WHERE table_schema = 'public'
                          AND table_name = 'Certificates'
                          AND column_name = 'CourseTitleSnapshot'
                    ) THEN
                        ALTER TABLE "Certificates" ADD COLUMN "CourseTitleSnapshot" character varying(200) NOT NULL DEFAULT '';
                    END IF;

                    IF NOT EXISTS (
                        SELECT 1
                        FROM information_schema.columns
                        WHERE table_schema = 'public'
                          AND table_name = 'Certificates'
                          AND column_name = 'DocumentUrl'
                    ) THEN
                        ALTER TABLE "Certificates" ADD COLUMN "DocumentUrl" character varying(1000);
                    END IF;

                    IF NOT EXISTS (
                        SELECT 1
                        FROM information_schema.columns
                        WHERE table_schema = 'public'
                          AND table_name = 'Certificates'
                          AND column_name = 'IssuedBy'
                    ) THEN
                        ALTER TABLE "Certificates" ADD COLUMN "IssuedBy" character varying(150) NOT NULL DEFAULT 'TalentFlow';
                    END IF;

                    IF NOT EXISTS (
                        SELECT 1
                        FROM information_schema.columns
                        WHERE table_schema = 'public'
                          AND table_name = 'Certificates'
                          AND column_name = 'RecipientCohortLabel'
                    ) THEN
                        ALTER TABLE "Certificates" ADD COLUMN "RecipientCohortLabel" character varying(50);
                    END IF;

                    IF NOT EXISTS (
                        SELECT 1
                        FROM information_schema.columns
                        WHERE table_schema = 'public'
                          AND table_name = 'Certificates'
                          AND column_name = 'RecipientDiscipline'
                    ) THEN
                        ALTER TABLE "Certificates" ADD COLUMN "RecipientDiscipline" character varying(100) NOT NULL DEFAULT '';
                    END IF;

                    IF NOT EXISTS (
                        SELECT 1
                        FROM information_schema.columns
                        WHERE table_schema = 'public'
                          AND table_name = 'Certificates'
                          AND column_name = 'RecipientFullName'
                    ) THEN
                        ALTER TABLE "Certificates" ADD COLUMN "RecipientFullName" character varying(200) NOT NULL DEFAULT '';
                    END IF;

                    IF NOT EXISTS (
                        SELECT 1
                        FROM information_schema.columns
                        WHERE table_schema = 'public'
                          AND table_name = 'Certificates'
                          AND column_name = 'RecipientPublicId'
                    ) THEN
                        ALTER TABLE "Certificates" ADD COLUMN "RecipientPublicId" character varying(32) NOT NULL DEFAULT '';
                    END IF;

                    IF NOT EXISTS (
                        SELECT 1
                        FROM information_schema.columns
                        WHERE table_schema = 'public'
                          AND table_name = 'Certificates'
                          AND column_name = 'TemplateVersion'
                    ) THEN
                        ALTER TABLE "Certificates" ADD COLUMN "TemplateVersion" character varying(32) NOT NULL DEFAULT 'v1';
                    END IF;
                END
                $$;
                """);

            migrationBuilder.Sql("""
                -- Use a WHERE clause to join to the target table instead of
                -- referencing the target alias inside the FROM/JOIN, which is
                -- not allowed by PostgreSQL's planner for UPDATE...FROM.
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
                FROM "Users" AS u, "Courses" AS cr
                WHERE u."Id" = c."UserId" AND cr."Id" = c."CourseId";
                """);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("""
                DO $$
                BEGIN
                    IF EXISTS (
                        SELECT 1
                        FROM information_schema.columns
                        WHERE table_schema = 'public'
                          AND table_name = 'Certificates'
                          AND column_name = 'CompletedAt'
                    ) THEN
                        ALTER TABLE "Certificates" DROP COLUMN "CompletedAt";
                    END IF;

                    IF EXISTS (
                        SELECT 1
                        FROM information_schema.columns
                        WHERE table_schema = 'public'
                          AND table_name = 'Certificates'
                          AND column_name = 'CourseTitleSnapshot'
                    ) THEN
                        ALTER TABLE "Certificates" DROP COLUMN "CourseTitleSnapshot";
                    END IF;

                    IF EXISTS (
                        SELECT 1
                        FROM information_schema.columns
                        WHERE table_schema = 'public'
                          AND table_name = 'Certificates'
                          AND column_name = 'DocumentUrl'
                    ) THEN
                        ALTER TABLE "Certificates" DROP COLUMN "DocumentUrl";
                    END IF;

                    IF EXISTS (
                        SELECT 1
                        FROM information_schema.columns
                        WHERE table_schema = 'public'
                          AND table_name = 'Certificates'
                          AND column_name = 'IssuedBy'
                    ) THEN
                        ALTER TABLE "Certificates" DROP COLUMN "IssuedBy";
                    END IF;

                    IF EXISTS (
                        SELECT 1
                        FROM information_schema.columns
                        WHERE table_schema = 'public'
                          AND table_name = 'Certificates'
                          AND column_name = 'RecipientCohortLabel'
                    ) THEN
                        ALTER TABLE "Certificates" DROP COLUMN "RecipientCohortLabel";
                    END IF;

                    IF EXISTS (
                        SELECT 1
                        FROM information_schema.columns
                        WHERE table_schema = 'public'
                          AND table_name = 'Certificates'
                          AND column_name = 'RecipientDiscipline'
                    ) THEN
                        ALTER TABLE "Certificates" DROP COLUMN "RecipientDiscipline";
                    END IF;

                    IF EXISTS (
                        SELECT 1
                        FROM information_schema.columns
                        WHERE table_schema = 'public'
                          AND table_name = 'Certificates'
                          AND column_name = 'RecipientFullName'
                    ) THEN
                        ALTER TABLE "Certificates" DROP COLUMN "RecipientFullName";
                    END IF;

                    IF EXISTS (
                        SELECT 1
                        FROM information_schema.columns
                        WHERE table_schema = 'public'
                          AND table_name = 'Certificates'
                          AND column_name = 'RecipientPublicId'
                    ) THEN
                        ALTER TABLE "Certificates" DROP COLUMN "RecipientPublicId";
                    END IF;

                    IF EXISTS (
                        SELECT 1
                        FROM information_schema.columns
                        WHERE table_schema = 'public'
                          AND table_name = 'Certificates'
                          AND column_name = 'TemplateVersion'
                    ) THEN
                        ALTER TABLE "Certificates" DROP COLUMN "TemplateVersion";
                    END IF;
                END
                $$;
                """);
        }
    }
}
