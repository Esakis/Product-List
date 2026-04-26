using Microsoft.AspNetCore.SignalR;
using ProductList.Api.Hubs;
using ProductList.Api.Models;

namespace ProductList.Api.Services;

public sealed class SignalRProductEventPublisher : IProductEventPublisher
{
    public const string ProductAddedEventName = "productAdded";

    private readonly IHubContext<ProductsHub> _hubContext;

    public SignalRProductEventPublisher(IHubContext<ProductsHub> hubContext)
    {
        _hubContext = hubContext;
    }

    public Task NotifyProductAddedAsync(ProductDto product, CancellationToken cancellationToken)
    {
        return _hubContext.Clients.All.SendAsync(ProductAddedEventName, product, cancellationToken);
    }
}
