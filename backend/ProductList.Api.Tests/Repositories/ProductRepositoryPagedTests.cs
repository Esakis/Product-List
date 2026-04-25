using FluentAssertions;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using ProductList.Api.Infrastructure.Persistence;
using ProductList.Api.Models;
using ProductList.Api.Repositories;

namespace ProductList.Api.Tests.Repositories;

public sealed class ProductRepositoryPagedTests : IAsyncLifetime
{
    private SqliteConnection _connection = null!;
    private CatalogDbContext _dbContext = null!;
    private ProductRepository _repository = null!;

    public async Task InitializeAsync()
    {
        _connection = new SqliteConnection("Filename=:memory:");
        await _connection.OpenAsync();

        var options = new DbContextOptionsBuilder<CatalogDbContext>()
            .UseSqlite(_connection)
            .Options;

        _dbContext = new CatalogDbContext(options);
        await _dbContext.Database.EnsureCreatedAsync();
        await _dbContext.Products.ExecuteDeleteAsync();

        _repository = new ProductRepository(_dbContext);
    }

    public async Task DisposeAsync()
    {
        await _dbContext.DisposeAsync();
        await _connection.DisposeAsync();
    }

    [Fact]
    public async Task GetPagedAsync_without_filters_returns_all_products_ordered_by_name()
    {
        await SeedProductsAsync(
            ("PRD-001", "Whole Bean Coffee", 49.99m),
            ("PRD-002", "Black Leaf Tea", 24.50m),
            ("PRD-003", "Dark Chocolate", 12.99m));

        var result = await _repository.GetPagedAsync(new ProductQueryRequest(null, null), CancellationToken.None);

        result.Total.Should().Be(3);
        result.Items.Select(p => p.Name).Should().ContainInOrder("Black Leaf Tea", "Dark Chocolate", "Whole Bean Coffee");
        result.Page.Should().Be(1);
        result.PageSize.Should().Be(20);
    }

    [Fact]
    public async Task GetPagedAsync_filters_by_code_substring_case_insensitive()
    {
        await SeedProductsAsync(
            ("PRD-001", "Coffee", 1m),
            ("PRD-002", "Tea", 2m),
            ("OTH-100", "Other", 3m));

        var result = await _repository.GetPagedAsync(new ProductQueryRequest("prd", null), CancellationToken.None);

        result.Total.Should().Be(2);
        result.Items.Select(p => p.Code).Should().BeEquivalentTo(new[] { "PRD-001", "PRD-002" });
    }

    [Fact]
    public async Task GetPagedAsync_filters_by_name_substring_case_insensitive()
    {
        await SeedProductsAsync(
            ("PRD-001", "Coffee Premium", 1m),
            ("PRD-002", "Tea Bag", 2m),
            ("PRD-003", "Iced Coffee", 3m));

        var result = await _repository.GetPagedAsync(new ProductQueryRequest(null, "coffee"), CancellationToken.None);

        result.Total.Should().Be(2);
        result.Items.Select(p => p.Name).Should().BeEquivalentTo(new[] { "Coffee Premium", "Iced Coffee" });
    }

    [Fact]
    public async Task GetPagedAsync_combines_code_and_name_filters_with_and_semantics()
    {
        await SeedProductsAsync(
            ("PRD-001", "Coffee", 1m),
            ("PRD-002", "Tea", 2m),
            ("OTH-100", "Coffee Beans", 3m));

        var result = await _repository.GetPagedAsync(new ProductQueryRequest("prd", "coffee"), CancellationToken.None);

        result.Total.Should().Be(1);
        result.Items.Single().Code.Should().Be("PRD-001");
    }

    [Fact]
    public async Task GetPagedAsync_treats_percent_sign_as_literal_text()
    {
        await SeedProductsAsync(
            ("PRD-001", "Discount 50% Off", 1m),
            ("PRD-002", "Regular Item", 2m));

        var result = await _repository.GetPagedAsync(new ProductQueryRequest(null, "50%"), CancellationToken.None);

        result.Total.Should().Be(1);
        result.Items.Single().Name.Should().Be("Discount 50% Off");
    }

    [Fact]
    public async Task GetPagedAsync_treats_underscore_as_literal_text()
    {
        await SeedProductsAsync(
            ("PRD-001", "Snake_Case", 1m),
            ("PRD-002", "SnakeXCase", 2m));

        var result = await _repository.GetPagedAsync(new ProductQueryRequest(null, "Snake_Case"), CancellationToken.None);

        result.Total.Should().Be(1);
        result.Items.Single().Name.Should().Be("Snake_Case");
    }

    [Fact]
    public async Task GetPagedAsync_paginates_results_using_skip_and_take()
    {
        var seeds = Enumerable.Range(1, 25)
            .Select(i => ($"PRD-{i:000}", $"Product {i:000}", (decimal)i))
            .ToArray();
        await SeedProductsAsync(seeds);

        var page1 = await _repository.GetPagedAsync(new ProductQueryRequest(null, null, 1, 10), CancellationToken.None);
        var page2 = await _repository.GetPagedAsync(new ProductQueryRequest(null, null, 2, 10), CancellationToken.None);
        var page3 = await _repository.GetPagedAsync(new ProductQueryRequest(null, null, 3, 10), CancellationToken.None);

        page1.Total.Should().Be(25);
        page1.Items.Should().HaveCount(10);
        page2.Items.Should().HaveCount(10);
        page3.Items.Should().HaveCount(5);
        page1.Items.Select(p => p.Name).Should().NotIntersectWith(page2.Items.Select(p => p.Name));
    }

    [Fact]
    public async Task GetPagedAsync_returns_empty_items_but_real_total_when_page_beyond_range()
    {
        await SeedProductsAsync(
            ("PRD-001", "Coffee", 1m),
            ("PRD-002", "Tea", 2m));

        var result = await _repository.GetPagedAsync(new ProductQueryRequest(null, null, 5, 10), CancellationToken.None);

        result.Total.Should().Be(2);
        result.Items.Should().BeEmpty();
        result.Page.Should().Be(5);
    }

    private async Task SeedProductsAsync(params (string Code, string Name, decimal Price)[] products)
    {
        foreach (var (code, name, price) in products)
        {
            _dbContext.Products.Add(new Product { Code = code, Name = name, Price = price });
        }
        await _dbContext.SaveChangesAsync();
    }
}
