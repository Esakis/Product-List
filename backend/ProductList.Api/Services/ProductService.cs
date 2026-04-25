using FluentValidation;
using ProductList.Api.Common.Errors;
using ProductList.Api.Common.Paging;
using ProductList.Api.Models;
using ProductList.Api.Repositories;

namespace ProductList.Api.Services;

public sealed class ProductService : IProductService
{
    private readonly IProductRepository _productRepository;
    private readonly IValidator<CreateProductRequest> _createProductRequestValidator;
    private readonly IValidator<ProductQueryRequest> _productQueryRequestValidator;

    public ProductService(
        IProductRepository productRepository,
        IValidator<CreateProductRequest> createProductRequestValidator,
        IValidator<ProductQueryRequest> productQueryRequestValidator)
    {
        _productRepository = productRepository;
        _createProductRequestValidator = createProductRequestValidator;
        _productQueryRequestValidator = productQueryRequestValidator;
    }

    public async Task<IReadOnlyList<ProductDto>> GetAllAsync(CancellationToken cancellationToken)
    {
        var products = await _productRepository.GetAllAsync(cancellationToken);
        return products.Select(product => product.ToDto()).ToList();
    }

    public async Task<PagedResult<ProductDto>> SearchAsync(ProductQueryRequest filter, CancellationToken cancellationToken)
    {
        await _productQueryRequestValidator.ValidateAndThrowAsync(filter, cancellationToken);

        var page = await _productRepository.GetPagedAsync(filter, cancellationToken);
        var dtoItems = page.Items.Select(product => product.ToDto()).ToList();
        return new PagedResult<ProductDto>(dtoItems, page.Total, page.Page, page.PageSize);
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
