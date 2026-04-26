using FluentAssertions;
using ProductList.Api.Models;
using ProductList.Api.Repositories;

namespace ProductList.Api.Tests.Repositories;

public sealed class InMemoryProductRepositoryTests
{
    private InMemoryProductRepository CreateRepository()
    {
        return new InMemoryProductRepository();
    }

    [Fact]
    public async Task GetAllAsync_returns_seeded_products_sorted_by_name()
    {
        var repository = CreateRepository();

        var result = await repository.GetAllAsync(CancellationToken.None);

        result.Should().NotBeEmpty();
        result.Select(p => p.Name).Should().BeInAscendingOrder();
    }

    [Fact]
    public async Task AddAsync_assigns_id_and_persists_product()
    {
        var repository = CreateRepository();
        var product = new Product { Code = "NEW-001", Name = "New Product", Price = 19.99m };

        var saved = await repository.AddAsync(product, CancellationToken.None);

        saved.Id.Should().BeGreaterThan(0);
        var all = await repository.GetAllAsync(CancellationToken.None);
        all.Should().Contain(p => p.Code == "NEW-001" && p.Name == "New Product" && p.Price == 19.99m);
    }

    [Fact]
    public async Task AddAsync_returns_a_clone_not_the_same_reference()
    {
        var repository = CreateRepository();
        var product = new Product { Code = "CLN-001", Name = "Clone Test", Price = 5.00m };

        var saved = await repository.AddAsync(product, CancellationToken.None);
        saved.Name = "Mutated";

        var all = await repository.GetAllAsync(CancellationToken.None);
        all.Should().Contain(p => p.Code == "CLN-001" && p.Name == "Clone Test");
    }

    [Fact]
    public async Task ExistsByCodeAsync_returns_true_for_seeded_code()
    {
        var repository = CreateRepository();

        var exists = await repository.ExistsByCodeAsync("PRD-001", CancellationToken.None);

        exists.Should().BeTrue();
    }

    [Fact]
    public async Task ExistsByCodeAsync_returns_false_for_unknown_code()
    {
        var repository = CreateRepository();

        var exists = await repository.ExistsByCodeAsync("UNKNOWN", CancellationToken.None);

        exists.Should().BeFalse();
    }

    [Fact]
    public async Task ExistsByCodeAsync_is_case_insensitive()
    {
        var repository = CreateRepository();

        var exists = await repository.ExistsByCodeAsync("prd-001", CancellationToken.None);

        exists.Should().BeTrue();
    }

    [Fact]
    public async Task ExistsByNameAsync_returns_true_for_seeded_name()
    {
        var repository = CreateRepository();

        var exists = await repository.ExistsByNameAsync("Whole Bean Coffee 1kg", CancellationToken.None);

        exists.Should().BeTrue();
    }

    [Fact]
    public async Task ExistsByNameAsync_returns_false_for_unknown_name()
    {
        var repository = CreateRepository();

        var exists = await repository.ExistsByNameAsync("Unknown Product", CancellationToken.None);

        exists.Should().BeFalse();
    }

    [Fact]
    public async Task GetPagedAsync_filters_by_code_substring_case_insensitive()
    {
        var repository = CreateRepository();

        var result = await repository.GetPagedAsync(
            new ProductQueryRequest("prd-00", null), CancellationToken.None);

        result.Items.Should().NotBeEmpty();
        result.Items.Should().AllSatisfy(p => p.Code.Should().ContainEquivalentOf("prd-00"));
    }

    [Fact]
    public async Task GetPagedAsync_filters_by_name_substring_case_insensitive()
    {
        var repository = CreateRepository();

        var result = await repository.GetPagedAsync(
            new ProductQueryRequest(null, "coffee"), CancellationToken.None);

        result.Items.Should().NotBeEmpty();
        result.Items.Should().AllSatisfy(p => p.Name.Should().ContainEquivalentOf("coffee"));
    }

    [Fact]
    public async Task GetPagedAsync_paginates_results()
    {
        var repository = CreateRepository();

        var page1 = await repository.GetPagedAsync(
            new ProductQueryRequest(null, null, 1, 3), CancellationToken.None);
        var page2 = await repository.GetPagedAsync(
            new ProductQueryRequest(null, null, 2, 3), CancellationToken.None);

        page1.Items.Should().HaveCount(3);
        page2.Items.Should().HaveCount(3);
        page1.Items.Select(p => p.Id).Should().NotIntersectWith(page2.Items.Select(p => p.Id));
        page1.Total.Should().Be(page2.Total);
    }

    [Fact]
    public async Task GetPagedAsync_returns_empty_items_for_page_beyond_range()
    {
        var repository = CreateRepository();

        var result = await repository.GetPagedAsync(
            new ProductQueryRequest(null, null, 100, 20), CancellationToken.None);

        result.Items.Should().BeEmpty();
        result.Total.Should().BeGreaterThan(0);
    }
}
