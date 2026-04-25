using Microsoft.EntityFrameworkCore;
using ProductList.Api.Infrastructure.Persistence;
using ProductList.Api.Models;

namespace ProductList.Api.Repositories;

public sealed class ProductRepository : IProductRepository
{
    private readonly CatalogDbContext _dbContext;

    public ProductRepository(CatalogDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<IReadOnlyList<Product>> GetAllAsync(CancellationToken cancellationToken)
    {
        return await _dbContext.Products
            .AsNoTracking()
            .OrderBy(product => product.Name)
            .ToListAsync(cancellationToken);
    }

    public Task<bool> ExistsByCodeAsync(string code, CancellationToken cancellationToken)
    {
        return _dbContext.Products
            .AsNoTracking()
            .AnyAsync(product => product.Code == code, cancellationToken);
    }

    public Task<bool> ExistsByNameAsync(string name, CancellationToken cancellationToken)
    {
        return _dbContext.Products
            .AsNoTracking()
            .AnyAsync(product => product.Name == name, cancellationToken);
    }

    public async Task<Product> AddAsync(Product product, CancellationToken cancellationToken)
    {
        await _dbContext.Products.AddAsync(product, cancellationToken);
        await _dbContext.SaveChangesAsync(cancellationToken);
        return product;
    }
}
