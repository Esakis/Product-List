namespace ProductList.Api.Models;

public sealed record ProductQueryRequest(string? Code, string? Name, int Page = 1, int PageSize = 20);
