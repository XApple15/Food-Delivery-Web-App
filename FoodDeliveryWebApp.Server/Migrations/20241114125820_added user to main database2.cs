using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FoodDeliveryWebApp.API.Migrations
{
    /// <inheritdoc />
    public partial class addedusertomaindatabase2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "AuthID",
                table: "AspNetUsers",
                newName: "Auth");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Auth",
                table: "AspNetUsers",
                newName: "AuthID");
        }
    }
}
