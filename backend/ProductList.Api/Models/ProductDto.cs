namespace ProductList.Api.Models;

public sealed record ProductDto(int Id, string Code, string Name, decimal Price);
