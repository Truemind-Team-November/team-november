using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LMS.Infrastructure.Migrations
{
    public partial class DecoupleDisciplinesFromTeams : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Disciplines_Teams_TeamId",
                table: "Disciplines");

            migrationBuilder.DropIndex(
                name: "IX_Disciplines_TeamId",
                table: "Disciplines");

            migrationBuilder.DropColumn(
                name: "TeamId",
                table: "Disciplines");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "TeamId",
                table: "Disciplines",
                type: "uuid",
                nullable: false,
                defaultValue: Guid.Empty);

            migrationBuilder.CreateIndex(
                name: "IX_Disciplines_TeamId",
                table: "Disciplines",
                column: "TeamId");

            migrationBuilder.AddForeignKey(
                name: "FK_Disciplines_Teams_TeamId",
                table: "Disciplines",
                column: "TeamId",
                principalTable: "Teams",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
