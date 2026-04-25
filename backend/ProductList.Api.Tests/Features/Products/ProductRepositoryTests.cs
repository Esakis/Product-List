using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using ProductList.Api.Features.Products;
using ProductList.Api.Infrastructure.Persistence;

namespace ProductList.Api.Tests.Features.Products;

public sealed class ProductRepositoryTests
{
    private static CatalogDbContext CreateDbContext()
    {
        var options = new DbContextOptionsBuilder<CatalogDbContext>()
            .UseInMemoryDatabase(databaseName: $"catalog-{Guid.NewGuid()}")
            .Options;
        return new CatalogDbContext(options);
    }

    [Fact]
    public async Task GetAllAsync_returns_products_sorted_by_name_ascending()
    {
        await using var dbContext = CreateDbContext();
        dbContext.Products.AddRange(
            new Product { Code = "PRD-A", Name = "Zebra", Price = 1m },
            new Product { Code = "PRD-B", Name = "Apple", Price = 2m },
            new Product { Code = "PRD-C", Name = "Mango", Price = 3m });
        await dbContext.SaveChangesAsync();
        var repository = new ProductRepository(dbContext);

        var result = await repository.GetAllAsync(CancellationToken.None);

        result.Select(p => p.Name).Should().ContainInOrder("Apple", "Mango", "Zebra");
    }

    [Fact]
    public async Task ExistsByCodeAsync_returns_true_for_existing_code()
    {
        await using var dbContext = CreateDbContext();
        dbContext.Products.Add(new Product { Code = "PRD-EXISTS", Name = "Sample", Price = 10m });
        await dbContext.SaveChangesAsync();
        var repository = new ProductRepository(dbContext);

        var exists = await repository.ExistsByCodeAsync("PRD-EXISTS", CancellationToken.None);

        exists.Should().BeTrue();
    }

    [Fact]
    public async Task ExistsByCodeAsync_returns_false_for_unknown_code()
    {
        await using var dbContext = CreateDbContext();
        var repository = new ProductRepository(dbContext);

        var exists = await repository.ExistsByCodeAsync("PRD-MISSING", CancellationToken.None);

        exists.Should().BeFalse();
    }

    [Fact]
    public async Task ExistsByNameAsync_returns_true_for_existing_name()
    {
        await using var dbContext = CreateDbContext();
        dbContext.Products.Add(new Product { Code = "PRD-001", Name = "Existing Name", Price = 10m });
        await dbContext.SaveChangesAsync();
        var repository = new ProductRepository(dbContext);

        var exists = await repository.ExistsByNameAsync("Existing Name", CancellationToken.None);

        exists.Should().BeTrue();
    }

    [Fact]
    public async Task ExistsByNameAsync_returns_false_for_unknown_name()
    {
        await using var dbContext = CreateDbContext();
        var repository = new ProductRepository(dbContext);

        var exists = await repository.ExistsByNameAsync("Unknown Name", CancellationToken.None);

        exists.Should().BeFalse();
    }

    [Fact]
    public async Task AddAsync_persists_product_and_assigns_identifier()
    {
        await using var dbContext = CreateDbContext();
        var repository = new ProductRepository(dbContext);
        var product = new Product { Code = "PRD-NEW", Name = "Brand New", Price = 99.99m };

        var saved = await repository.AddAsync(product, CancellationToken.None);

        saved.Id.Should().BeGreaterThan(0);
        var fromDb = await dbContext.Products.FindAsync(saved.Id);
        fromDb.Should().NotBeNull();
        fromDb!.Code.Should().Be("PRD-NEW");
        fromDb.Name.Should().Be("Brand New");
        fromDb.Price.Should().Be(99.99m);
    }
}
