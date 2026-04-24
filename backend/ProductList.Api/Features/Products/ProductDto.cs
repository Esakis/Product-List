namespace ProductList.Api.Features.Products;

public sealed record ProductDto(int Id, string Code, string Name, decimal Price);
