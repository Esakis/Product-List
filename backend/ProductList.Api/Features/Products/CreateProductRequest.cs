namespace ProductList.Api.Features.Products;

public sealed record CreateProductRequest(string Code, string Name, decimal Price);
