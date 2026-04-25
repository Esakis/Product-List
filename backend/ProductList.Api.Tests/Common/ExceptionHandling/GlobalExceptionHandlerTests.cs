using System.Text.Json;
using FluentAssertions;
using FluentValidation;
using FluentValidation.Results;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging.Abstractions;
using ProductList.Api.Common.Errors;
using ProductList.Api.Common.ExceptionHandling;

namespace ProductList.Api.Tests.Common.ExceptionHandling;

public sealed class GlobalExceptionHandlerTests
{
    private static readonly JsonSerializerOptions JsonOptions = new(JsonSerializerDefaults.Web);
    private readonly GlobalExceptionHandler _handler = new(NullLogger<GlobalExceptionHandler>.Instance);

    [Fact]
    public async Task ConflictException_yields_409_problem_details()
    {
        var context = CreateHttpContext();

        var handled = await _handler.TryHandleAsync(
            context,
            new ConflictException("Duplicate code 'PRD-1'."),
            CancellationToken.None);

        handled.Should().BeTrue();
        context.Response.StatusCode.Should().Be(StatusCodes.Status409Conflict);
        var problem = await ReadProblemAsync<ProblemDetails>(context);
        problem.Status.Should().Be(StatusCodes.Status409Conflict);
        problem.Title.Should().Be("Conflict");
        problem.Detail.Should().Be("Duplicate code 'PRD-1'.");
    }

    [Fact]
    public async Task NotFoundException_yields_404_problem_details()
    {
        var context = CreateHttpContext();

        var handled = await _handler.TryHandleAsync(
            context,
            new NotFoundException("Missing product."),
            CancellationToken.None);

        handled.Should().BeTrue();
        context.Response.StatusCode.Should().Be(StatusCodes.Status404NotFound);
    }

    [Fact]
    public async Task ValidationException_yields_400_validation_problem_details()
    {
        var context = CreateHttpContext();
        var failures = new[]
        {
            new ValidationFailure("Code", "Code is required."),
            new ValidationFailure("Price", "Price must be at least 0.01.")
        };

        var handled = await _handler.TryHandleAsync(
            context,
            new ValidationException(failures),
            CancellationToken.None);

        handled.Should().BeTrue();
        context.Response.StatusCode.Should().Be(StatusCodes.Status400BadRequest);
        var problem = await ReadProblemAsync<ValidationProblemDetails>(context);
        problem.Errors.Should().ContainKey("Code")
            .WhoseValue.Should().Contain("Code is required.");
        problem.Errors.Should().ContainKey("Price");
    }

    [Fact]
    public async Task Unhandled_exception_yields_500_problem_details()
    {
        var context = CreateHttpContext();

        var handled = await _handler.TryHandleAsync(
            context,
            new InvalidOperationException("boom"),
            CancellationToken.None);

        handled.Should().BeTrue();
        context.Response.StatusCode.Should().Be(StatusCodes.Status500InternalServerError);
        var problem = await ReadProblemAsync<ProblemDetails>(context);
        problem.Detail.Should().Be("An unexpected server error occurred.");
    }

    private static DefaultHttpContext CreateHttpContext()
    {
        var context = new DefaultHttpContext();
        context.Response.Body = new MemoryStream();
        context.Request.Path = "/products";
        return context;
    }

    private static async Task<T> ReadProblemAsync<T>(HttpContext context)
    {
        context.Response.Body.Position = 0;
        var deserialized = await JsonSerializer.DeserializeAsync<T>(context.Response.Body, JsonOptions);
        deserialized.Should().NotBeNull();
        return deserialized!;
    }
}
