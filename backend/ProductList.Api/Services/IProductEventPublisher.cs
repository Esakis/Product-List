using ProductList.Api.Models;

namespace ProductList.Api.Services;

public interface IProductEventPublisher
{
    Task NotifyProductAddedAsync(ProductDto product, CancellationToken cancellationToken);
}
