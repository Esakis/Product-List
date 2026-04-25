using Microsoft.EntityFrameworkCore;
using ProductList.Api.Common.Paging;
using ProductList.Api.Infrastructure.Persistence;
using ProductList.Api.Models;

namespace ProductList.Api.Repositories;

public sealed class ProductRepository : IProductRepository
{
    private const string LikeEscapeCharacter = "\\";

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

    public async Task<PagedResult<Product>> GetPagedAsync(ProductQueryRequest filter, CancellationToken cancellationToken)
    {
        var query = _dbContext.Products.AsNoTracking();

        if (!string.IsNullOrWhiteSpace(filter.Code))
        {
            var codePattern = BuildContainsPattern(filter.Code);
            query = query.Where(product => EF.Functions.Like(product.Code, codePattern, LikeEscapeCharacter));
        }

        if (!string.IsNullOrWhiteSpace(filter.Name))
        {
            var namePattern = BuildContainsPattern(filter.Name);
            query = query.Where(product => EF.Functions.Like(product.Name, namePattern, LikeEscapeCharacter));
        }

        var total = await query.CountAsync(cancellationToken);

        var items = await query
            .OrderBy(product => product.Name)
            .ThenBy(product => product.Id)
            .Skip((filter.Page - 1) * filter.PageSize)
            .Take(filter.PageSize)
            .ToListAsync(cancellationToken);

        return new PagedResult<Product>(items, total, filter.Page, filter.PageSize);
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

    private static string BuildContainsPattern(string value)
    {
        var escaped = value
            .Replace(LikeEscapeCharacter, LikeEscapeCharacter + LikeEscapeCharacter)
            .Replace("%", LikeEscapeCharacter + "%")
            .Replace("_", LikeEscapeCharacter + "_")
            .Replace("[", LikeEscapeCharacter + "[");
        return $"%{escaped}%";
    }
}
