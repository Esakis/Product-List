using FluentValidation;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using ProductList.Api.Common.ExceptionHandling;
using ProductList.Api.Hubs;
using ProductList.Api.Infrastructure.Persistence;
using ProductList.Api.Repositories;
using ProductList.Api.Services;
using ProductList.Api.Validators;

const string AngularDevCorsPolicy = "AngularDev";
const string AngularDevOrigin = "http://localhost:4200";

var builder = WebApplication.CreateBuilder(args);

var catalogConnectionString = builder.Configuration.GetConnectionString("Catalog")
    ?? throw new InvalidOperationException("Connection string 'Catalog' is not configured.");

builder.Services.AddDbContext<CatalogDbContext>(options =>
    options.UseSqlServer(catalogConnectionString));

builder.Services.AddScoped<IProductRepository, ProductRepository>();
builder.Services.AddScoped<IProductService, ProductService>();
builder.Services.AddSingleton<IProductEventPublisher, SignalRProductEventPublisher>();
builder.Services.AddValidatorsFromAssemblyContaining<CreateProductRequestValidator>();

builder.Services.AddSignalR();

builder.Services.AddControllers()
    .ConfigureApiBehaviorOptions(options => options.SuppressModelStateInvalidFilter = true);

builder.Services.AddExceptionHandler<GlobalExceptionHandler>();
builder.Services.AddProblemDetails();

builder.Services.AddCors(options =>
{
    options.AddPolicy(AngularDevCorsPolicy, policy => policy
        .WithOrigins(AngularDevOrigin)
        .WithMethods("GET", "POST")
        .AllowAnyHeader()
        .AllowCredentials());
});

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Product List API",
        Version = "v1",
        Description = "REST API for managing the product catalog."
    });
});

var app = builder.Build();

app.UseExceptionHandler();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();

    using var scope = app.Services.CreateScope();
    var dbContext = scope.ServiceProvider.GetRequiredService<CatalogDbContext>();
    await dbContext.Database.MigrateAsync();
}
else
{
    app.UseHttpsRedirection();
}

app.UseCors(AngularDevCorsPolicy);

app.MapControllers();
app.MapHub<ProductsHub>("/hubs/products");

app.Run();
