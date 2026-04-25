using FluentValidation;
using ProductList.Api.Common.Errors;

namespace ProductList.Api.Features.Products;

public sealed class ProductService : IProductService
{
    private readonly IProductRepository _productRepository;
    private readonly IValidator<CreateProductRequest> _createProductRequestValidator;

    public ProductService(
        IProductRepository productRepository,
        IValidator<CreateProductRequest> createProductRequestValidator)
    {
        _productRepository = productRepository;
        _createProductRequestValidator = createProductRequestValidator;
    }

    public async Task<IReadOnlyList<ProductDto>> GetAllAsync(CancellationToken cancellationToken)
    {
        var products = await _productRepository.GetAllAsync(cancellationToken);
        return products.Select(product => product.ToDto()).ToList();
    }

    public async Task<ProductDto> CreateAsync(CreateProductRequest request, CancellationToken cancellationToken)
    {
        await _createProductRequestValidator.ValidateAndThrowAsync(request, cancellationToken);

        if (await _productRepository.ExistsByCodeAsync(request.Code, cancellationToken))
        {
            throw new ConflictException($"A product with code '{request.Code}' already exists.");
        }

        if (await _productRepository.ExistsByNameAsync(request.Name, cancellationToken))
        {
            throw new ConflictException($"A product with name '{request.Name}' already exists.");
        }

        var created = await _productRepository.AddAsync(request.ToEntity(), cancellationToken);
        return created.ToDto();
    }
}
