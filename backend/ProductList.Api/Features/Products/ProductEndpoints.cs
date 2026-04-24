namespace ProductList.Api.Features.Products;

public static class ProductEndpoints
{
    private const string ProductsTag = "Products";

    public static IEndpointRouteBuilder MapProductEndpoints(this IEndpointRouteBuilder endpoints)
    {
        var group = endpoints.MapGroup("/products").WithTags(ProductsTag);

        group.MapGet("/", GetAllAsync)
            .WithName("GetProducts")
            .Produces<IReadOnlyList<ProductDto>>(StatusCodes.Status200OK);

        group.MapPost("/", CreateAsync)
            .WithName("CreateProduct")
            .Produces<ProductDto>(StatusCodes.Status201Created)
            .ProducesValidationProblem()
            .ProducesProblem(StatusCodes.Status409Conflict);

        return endpoints;
    }

    private static async Task<IResult> GetAllAsync(
        IProductService productService,
        CancellationToken cancellationToken)
    {
        var products = await productService.GetAllAsync(cancellationToken);
        return Results.Ok(products);
    }

    private static async Task<IResult> CreateAsync(
        CreateProductRequest request,
        IProductService productService,
        CancellationToken cancellationToken)
    {
        var created = await productService.CreateAsync(request, cancellationToken);
        return Results.Created($"/products/{created.Id}", created);
    }
}
