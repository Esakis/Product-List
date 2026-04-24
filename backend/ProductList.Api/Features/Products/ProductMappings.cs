namespace ProductList.Api.Features.Products;

public static class ProductMappings
{
    public static ProductDto ToDto(this Product product)
    {
        return new ProductDto(product.Id, product.Code, product.Name, product.Price);
    }

    public static Product ToEntity(this CreateProductRequest request)
    {
        return new Product
        {
            Code = request.Code,
            Name = request.Name,
            Price = request.Price
        };
    }
}
