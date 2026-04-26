using ProductList.Api.Common.Paging;
using ProductList.Api.Models;

namespace ProductList.Api.Repositories;

public sealed class InMemoryProductRepository : IProductRepository
{
    private readonly object _lock = new();
    private readonly List<Product> _products = new();
    private int _nextId = 1;

    public InMemoryProductRepository()
    {
        SeedInitialData();
    }

    public Task<IReadOnlyList<Product>> GetAllAsync(CancellationToken cancellationToken)
    {
        lock (_lock)
        {
            var sorted = _products
                .OrderBy(product => product.Name)
                .Select(Clone)
                .ToList();
            return Task.FromResult<IReadOnlyList<Product>>(sorted);
        }
    }

    public Task<PagedResult<Product>> GetPagedAsync(ProductQueryRequest filter, CancellationToken cancellationToken)
    {
        lock (_lock)
        {
            IEnumerable<Product> query = _products;

            if (!string.IsNullOrWhiteSpace(filter.Code))
            {
                query = query.Where(product =>
                    product.Code.Contains(filter.Code, StringComparison.OrdinalIgnoreCase));
            }

            if (!string.IsNullOrWhiteSpace(filter.Name))
            {
                query = query.Where(product =>
                    product.Name.Contains(filter.Name, StringComparison.OrdinalIgnoreCase));
            }

            var filtered = query.ToList();
            var total = filtered.Count;

            var items = filtered
                .OrderBy(product => product.Name)
                .ThenBy(product => product.Id)
                .Skip((filter.Page - 1) * filter.PageSize)
                .Take(filter.PageSize)
                .Select(Clone)
                .ToList();

            return Task.FromResult(new PagedResult<Product>(items, total, filter.Page, filter.PageSize));
        }
    }

    public Task<bool> ExistsByCodeAsync(string code, CancellationToken cancellationToken)
    {
        lock (_lock)
        {
            var exists = _products.Any(product =>
                string.Equals(product.Code, code, StringComparison.OrdinalIgnoreCase));
            return Task.FromResult(exists);
        }
    }

    public Task<bool> ExistsByNameAsync(string name, CancellationToken cancellationToken)
    {
        lock (_lock)
        {
            var exists = _products.Any(product =>
                string.Equals(product.Name, name, StringComparison.OrdinalIgnoreCase));
            return Task.FromResult(exists);
        }
    }

    public Task<Product> AddAsync(Product product, CancellationToken cancellationToken)
    {
        lock (_lock)
        {
            product.Id = _nextId++;
            _products.Add(Clone(product));
            return Task.FromResult(Clone(product));
        }
    }

    private static Product Clone(Product source)
    {
        return new Product
        {
            Id = source.Id,
            Code = source.Code,
            Name = source.Name,
            Price = source.Price
        };
    }

    private void SeedInitialData()
    {
        var seeds = new (string Code, string Name, decimal Price)[]
        {
            ("PRD-001", "Whole Bean Coffee 1kg", 49.99m),
            ("PRD-002", "Black Leaf Tea 200g", 24.50m),
            ("PRD-003", "Dark Chocolate 70% Bar", 12.99m),
            ("PRD-004", "Multiflower Honey 500g", 34.00m),
            ("PRD-005", "Extra Virgin Olive Oil 750ml", 59.90m),
            ("PRD-006", "Himalayan Pink Salt 250g", 14.99m),
            ("PRD-007", "Organic Brown Sugar 1kg", 9.50m),
            ("PRD-008", "Basmati Rice 2kg", 22.99m),
            ("PRD-009", "Whole Wheat Pasta 500g", 6.49m),
            ("PRD-010", "Aged Balsamic Vinegar 250ml", 39.00m)
        };

        foreach (var (code, name, price) in seeds)
        {
            _products.Add(new Product { Id = _nextId++, Code = code, Name = name, Price = price });
        }
    }
}
