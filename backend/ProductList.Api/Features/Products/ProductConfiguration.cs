using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ProductList.Api.Features.Products;

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

        builder.Property(product => product.Price)
            .HasPrecision(PricePrecision, PriceScale);

        builder.HasData(
            new Product { Id = 1, Code = "PRD-001", Name = "Whole Bean Coffee", Price = 49.99m },
            new Product { Id = 2, Code = "PRD-002", Name = "Black Leaf Tea", Price = 24.50m },
            new Product { Id = 3, Code = "PRD-003", Name = "Dark Chocolate 70%", Price = 12.99m },
            new Product { Id = 4, Code = "PRD-004", Name = "Multiflower Honey 500g", Price = 34.00m },
            new Product { Id = 5, Code = "PRD-005", Name = "Extra Virgin Olive Oil", Price = 59.90m }
        );
    }
}
