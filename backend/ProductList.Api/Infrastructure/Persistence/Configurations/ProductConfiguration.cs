using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using ProductList.Api.Models;

namespace ProductList.Api.Infrastructure.Persistence.Configurations;

public sealed class ProductConfiguration : IEntityTypeConfiguration<Product>
{
    private const int CodeMaxLength = 50;
    private const int NameMaxLength = 200;
    private const int PricePrecision = 18;
    private const int PriceScale = 2;

    public void Configure(EntityTypeBuilder<Product> builder)
    {
        builder.ToTable("Products");

        builder.HasKey(product => product.Id);

        builder.Property(product => product.Code)
            .IsRequired()
            .HasMaxLength(CodeMaxLength);

        builder.HasIndex(product => product.Code)
            .IsUnique();

        builder.Property(product => product.Name)
            .IsRequired()
            .HasMaxLength(NameMaxLength);

        builder.HasIndex(product => product.Name);

        builder.Property(product => product.Price)
            .HasPrecision(PricePrecision, PriceScale);

        builder.HasData(
            new Product { Id = 1, Code = "PRD-001", Name = "Whole Bean Coffee 1kg", Price = 49.99m },
            new Product { Id = 2, Code = "PRD-002", Name = "Black Leaf Tea 200g", Price = 24.50m },
            new Product { Id = 3, Code = "PRD-003", Name = "Dark Chocolate 70% Bar", Price = 12.99m },
            new Product { Id = 4, Code = "PRD-004", Name = "Multiflower Honey 500g", Price = 34.00m },
            new Product { Id = 5, Code = "PRD-005", Name = "Extra Virgin Olive Oil 750ml", Price = 59.90m },
            new Product { Id = 6, Code = "PRD-006", Name = "Himalayan Pink Salt 250g", Price = 14.99m },
            new Product { Id = 7, Code = "PRD-007", Name = "Organic Brown Sugar 1kg", Price = 9.50m },
            new Product { Id = 8, Code = "PRD-008", Name = "Basmati Rice 2kg", Price = 22.99m },
            new Product { Id = 9, Code = "PRD-009", Name = "Whole Wheat Pasta 500g", Price = 6.49m },
            new Product { Id = 10, Code = "PRD-010", Name = "Aged Balsamic Vinegar 250ml", Price = 39.00m },
            new Product { Id = 11, Code = "PRD-011", Name = "Smoked Paprika 100g", Price = 11.50m },
            new Product { Id = 12, Code = "PRD-012", Name = "Green Pesto Sauce 190g", Price = 18.99m },
            new Product { Id = 13, Code = "PRD-013", Name = "Sun-Dried Tomatoes 280g", Price = 16.75m },
            new Product { Id = 14, Code = "PRD-014", Name = "Almond Butter 350g", Price = 28.90m },
            new Product { Id = 15, Code = "PRD-015", Name = "Maple Syrup 250ml", Price = 32.50m },
            new Product { Id = 16, Code = "PRD-016", Name = "Roasted Cashew Nuts 200g", Price = 19.99m },
            new Product { Id = 17, Code = "PRD-017", Name = "Mixed Dried Fruits 300g", Price = 17.50m },
            new Product { Id = 18, Code = "PRD-018", Name = "Dark Roast Espresso Beans 500g", Price = 54.99m },
            new Product { Id = 19, Code = "PRD-019", Name = "Earl Grey Tea Tin 125g", Price = 27.00m },
            new Product { Id = 20, Code = "PRD-020", Name = "Belgian Milk Chocolate Bar", Price = 8.99m },
            new Product { Id = 21, Code = "PRD-021", Name = "Sparkling Mineral Water 6-Pack", Price = 12.00m },
            new Product { Id = 22, Code = "PRD-022", Name = "Cold-Pressed Apple Juice 1L", Price = 9.99m },
            new Product { Id = 23, Code = "PRD-023", Name = "Mediterranean Sea Salt 200g", Price = 7.49m },
            new Product { Id = 24, Code = "PRD-024", Name = "Black Peppercorns 100g", Price = 13.50m },
            new Product { Id = 25, Code = "PRD-025", Name = "Vanilla Extract 100ml", Price = 21.99m },
            new Product { Id = 26, Code = "PRD-026", Name = "Rolled Oats 1kg", Price = 8.49m },
            new Product { Id = 27, Code = "PRD-027", Name = "Chia Seeds 250g", Price = 15.99m },
            new Product { Id = 28, Code = "PRD-028", Name = "Tricolor Quinoa 500g", Price = 18.50m },
            new Product { Id = 29, Code = "PRD-029", Name = "Coconut Milk 400ml", Price = 6.99m },
            new Product { Id = 30, Code = "PRD-030", Name = "Greek Yogurt 500g", Price = 7.50m }
        );
    }
}
