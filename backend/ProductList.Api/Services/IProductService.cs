using ProductList.Api.Common.Paging;
using ProductList.Api.Models;

namespace ProductList.Api.Services;

public interface IProductService
{
    Task<IReadOnlyList<ProductDto>> GetAllAsync(CancellationToken cancellationToken);
    Task<PagedResult<ProductDto>> SearchAsync(ProductQueryRequest filter, CancellationToken cancellationToken);
    Task<ProductDto> CreateAsync(CreateProductRequest request, CancellationToken cancellationToken);
}
