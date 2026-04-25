using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace ProductList.Api.Migrations
{
    /// <inheritdoc />
    public partial class SeedThirtyProducts : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 1,
                column: "Name",
                value: "Whole Bean Coffee 1kg");

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 2,
                column: "Name",
                value: "Black Leaf Tea 200g");

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 3,
                column: "Name",
                value: "Dark Chocolate 70% Bar");

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 5,
                column: "Name",
                value: "Extra Virgin Olive Oil 750ml");

            migrationBuilder.InsertData(
                table: "Products",
                columns: new[] { "Id", "Code", "Name", "Price" },
                values: new object[,]
                {
                    { 6, "PRD-006", "Himalayan Pink Salt 250g", 14.99m },
                    { 7, "PRD-007", "Organic Brown Sugar 1kg", 9.50m },
                    { 8, "PRD-008", "Basmati Rice 2kg", 22.99m },
                    { 9, "PRD-009", "Whole Wheat Pasta 500g", 6.49m },
                    { 10, "PRD-010", "Aged Balsamic Vinegar 250ml", 39.00m },
                    { 11, "PRD-011", "Smoked Paprika 100g", 11.50m },
                    { 12, "PRD-012", "Green Pesto Sauce 190g", 18.99m },
                    { 13, "PRD-013", "Sun-Dried Tomatoes 280g", 16.75m },
                    { 14, "PRD-014", "Almond Butter 350g", 28.90m },
                    { 15, "PRD-015", "Maple Syrup 250ml", 32.50m },
                    { 16, "PRD-016", "Roasted Cashew Nuts 200g", 19.99m },
                    { 17, "PRD-017", "Mixed Dried Fruits 300g", 17.50m },
                    { 18, "PRD-018", "Dark Roast Espresso Beans 500g", 54.99m },
                    { 19, "PRD-019", "Earl Grey Tea Tin 125g", 27.00m },
                    { 20, "PRD-020", "Belgian Milk Chocolate Bar", 8.99m },
                    { 21, "PRD-021", "Sparkling Mineral Water 6-Pack", 12.00m },
                    { 22, "PRD-022", "Cold-Pressed Apple Juice 1L", 9.99m },
                    { 23, "PRD-023", "Mediterranean Sea Salt 200g", 7.49m },
                    { 24, "PRD-024", "Black Peppercorns 100g", 13.50m },
                    { 25, "PRD-025", "Vanilla Extract 100ml", 21.99m },
                    { 26, "PRD-026", "Rolled Oats 1kg", 8.49m },
                    { 27, "PRD-027", "Chia Seeds 250g", 15.99m },
                    { 28, "PRD-028", "Tricolor Quinoa 500g", 18.50m },
                    { 29, "PRD-029", "Coconut Milk 400ml", 6.99m },
                    { 30, "PRD-030", "Greek Yogurt 500g", 7.50m }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 6);

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 7);

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 8);

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 9);

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 10);

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 11);

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 12);

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 13);

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 14);

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 15);

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 16);

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 17);

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 18);

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 19);

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 20);

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 21);

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 22);

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 23);

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 24);

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 25);

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 26);

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 27);

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 28);

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 29);

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 30);

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 1,
                column: "Name",
                value: "Whole Bean Coffee");

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 2,
                column: "Name",
                value: "Black Leaf Tea");

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 3,
                column: "Name",
                value: "Dark Chocolate 70%");

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 5,
                column: "Name",
                value: "Extra Virgin Olive Oil");
        }
    }
}
