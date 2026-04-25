namespace ProductList.Api.Models;

public sealed record CreateProductRequest(string Code, string Name, decimal Price);
