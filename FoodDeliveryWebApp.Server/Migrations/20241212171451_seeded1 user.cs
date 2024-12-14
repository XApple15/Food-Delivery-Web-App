using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FoodDeliveryWebApp.Server.Migrations
{
    /// <inheritdoc />
    public partial class seeded1user : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "AspNetUsers",
                columns: new[] { "Id", "AccessFailedCount", "Address", "AdminData", "ConcurrencyStamp", "CourierData", "Email", "EmailConfirmed", "LockoutEnabled", "LockoutEnd", "Name", "NormalUserData", "NormalizedEmail", "NormalizedUserName", "PasswordHash", "PhoneNumber", "PhoneNumberConfirmed", "SecurityStamp", "TwoFactorEnabled", "UserName" },
                values: new object[] { "db8d0a39-645e-4cd2-bcf9-b0ac0d93521b", 0, null, null, "f895b241-1e32-480c-9f33-11efc0e86309", null, "test", true, false, null, null, null, "TESTUSER@EXAMPLE.COM", "TESTUSER", "AQAAAAIAAYagAAAAEDGs/mVwcHbplqtAUzqegf2UoJD52HFNUvH48wpkmd9DRmP7hoxRik5sIUTvHbiNBw==", null, false, "df3ea310-081b-4780-9106-d024fdfe6048", false, "test" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "db8d0a39-645e-4cd2-bcf9-b0ac0d93521b");
        }
    }
}
