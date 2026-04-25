using FluentAssertions;
using ProductList.Api.Features.Products;

namespace ProductList.Api.Tests.Features.Products;

public sealed class ProductMappingsTests
{
    [Fact]
    public void ToDto_maps_all_fields_from_entity()
    {
        var product = new Product
        {
            Id = 7,
            Code = "PRD-007",
            Name = "Dark Roast Beans",
            Price = 39.99m
        };

        var dto = product.ToDto();

        dto.Should().BeEquivalentTo(new ProductDto(7, "PRD-007", "Dark Roast Beans", 39.99m));
    }

    [Fact]
    public void ToEntity_copies_request_fields_and_leaves_id_unset()
    {
        var request = new CreateProductRequest("PRD-008", "Green Tea", 21.50m);

        var entity = request.ToEntity();

        entity.Id.Should().Be(0);
        entity.Code.Should().Be("PRD-008");
        entity.Name.Should().Be("Green Tea");
        entity.Price.Should().Be(21.50m);
    }
}
