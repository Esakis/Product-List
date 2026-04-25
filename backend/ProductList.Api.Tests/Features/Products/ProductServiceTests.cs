using FluentAssertions;
using FluentValidation;
using NSubstitute;
using ProductList.Api.Common.Errors;
using ProductList.Api.Features.Products;

namespace ProductList.Api.Tests.Features.Products;

public sealed class ProductServiceTests
{
    private readonly IProductRepository _repository = Substitute.For<IProductRepository>();
    private readonly IValidator<CreateProductRequest> _validator = new CreateProductRequestValidator();
    private readonly ProductService _service;

    public ProductServiceTests()
    {
        _service = new ProductService(_repository, _validator);
    }

    [Fact]
    public async Task GetAllAsync_returns_dtos_mapped_from_repository()
    {
        var products = new List<Product>
        {
            new() { Id = 1, Code = "PRD-001", Name = "Coffee", Price = 49.99m },
            new() { Id = 2, Code = "PRD-002", Name = "Tea", Price = 24.50m }
        };
        _repository.GetAllAsync(Arg.Any<CancellationToken>()).Returns(products);

        var result = await _service.GetAllAsync(CancellationToken.None);

        result.Should().HaveCount(2);
        result[0].Should().BeEquivalentTo(new ProductDto(1, "PRD-001", "Coffee", 49.99m));
        result[1].Should().BeEquivalentTo(new ProductDto(2, "PRD-002", "Tea", 24.50m));
    }

    [Fact]
    public async Task CreateAsync_persists_request_and_returns_dto_for_unique_code()
    {
        var request = new CreateProductRequest("PRD-100", "New Product", 12.34m);
        _repository.ExistsByCodeAsync("PRD-100", Arg.Any<CancellationToken>()).Returns(false);
        _repository.AddAsync(Arg.Any<Product>(), Arg.Any<CancellationToken>())
            .Returns(callInfo =>
            {
                var product = callInfo.Arg<Product>();
                product.Id = 42;
                return product;
            });

        var result = await _service.CreateAsync(request, CancellationToken.None);

        result.Should().BeEquivalentTo(new ProductDto(42, "PRD-100", "New Product", 12.34m));
        await _repository.Received(1).ExistsByCodeAsync("PRD-100", Arg.Any<CancellationToken>());
        await _repository.Received(1).AddAsync(
            Arg.Is<Product>(p => p.Code == "PRD-100" && p.Name == "New Product" && p.Price == 12.34m),
            Arg.Any<CancellationToken>());
    }

    [Fact]
    public async Task CreateAsync_throws_validation_exception_for_invalid_request()
    {
        var request = new CreateProductRequest("", "", 0m);

        var act = () => _service.CreateAsync(request, CancellationToken.None);

        await act.Should().ThrowAsync<ValidationException>();
        await _repository.DidNotReceive().ExistsByCodeAsync(Arg.Any<string>(), Arg.Any<CancellationToken>());
        await _repository.DidNotReceive().AddAsync(Arg.Any<Product>(), Arg.Any<CancellationToken>());
    }

    [Fact]
    public async Task CreateAsync_throws_conflict_when_code_already_exists()
    {
        var request = new CreateProductRequest("PRD-001", "Duplicate", 10m);
        _repository.ExistsByCodeAsync("PRD-001", Arg.Any<CancellationToken>()).Returns(true);

        var act = () => _service.CreateAsync(request, CancellationToken.None);

        var exception = await act.Should().ThrowAsync<ConflictException>();
        exception.Which.Message.Should().Contain("PRD-001");
        await _repository.DidNotReceive().AddAsync(Arg.Any<Product>(), Arg.Any<CancellationToken>());
    }
}
