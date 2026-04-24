using FluentValidation;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using ProductList.Api.Common.Errors;

namespace ProductList.Api.Common.ExceptionHandling;

public sealed class GlobalExceptionHandler : IExceptionHandler
{
    private readonly ILogger<GlobalExceptionHandler> _logger;

    public GlobalExceptionHandler(ILogger<GlobalExceptionHandler> logger)
    {
        _logger = logger;
    }

    public async ValueTask<bool> TryHandleAsync(
        HttpContext httpContext,
        Exception exception,
        CancellationToken cancellationToken)
    {
        switch (exception)
        {
            case ValidationException validationException:
                await WriteValidationProblemAsync(httpContext, validationException, cancellationToken);
                return true;

            case ConflictException conflictException:
                await WriteProblemAsync(
                    httpContext,
                    StatusCodes.Status409Conflict,
                    "Conflict",
                    conflictException.Message,
                    cancellationToken);
                return true;

            case NotFoundException notFoundException:
                await WriteProblemAsync(
                    httpContext,
                    StatusCodes.Status404NotFound,
                    "Not found",
                    notFoundException.Message,
                    cancellationToken);
                return true;

            default:
                _logger.LogError(exception, "Unhandled exception processing request {Path}", httpContext.Request.Path);
                await WriteProblemAsync(
                    httpContext,
                    StatusCodes.Status500InternalServerError,
                    "Internal server error",
                    "An unexpected server error occurred.",
                    cancellationToken);
                return true;
        }
    }

    private static Task WriteValidationProblemAsync(
        HttpContext httpContext,
        ValidationException validationException,
        CancellationToken cancellationToken)
    {
        var errors = validationException.Errors
            .GroupBy(failure => failure.PropertyName)
            .ToDictionary(
                grouping => grouping.Key,
                grouping => grouping.Select(failure => failure.ErrorMessage).ToArray());

        var problemDetails = new ValidationProblemDetails(errors)
        {
            Status = StatusCodes.Status400BadRequest,
            Title = "Validation failed",
            Instance = httpContext.Request.Path
        };

        httpContext.Response.StatusCode = StatusCodes.Status400BadRequest;
        return httpContext.Response.WriteAsJsonAsync(problemDetails, cancellationToken: cancellationToken);
    }

    private static Task WriteProblemAsync(
        HttpContext httpContext,
        int statusCode,
        string title,
        string detail,
        CancellationToken cancellationToken)
    {
        var problemDetails = new ProblemDetails
        {
            Status = statusCode,
            Title = title,
            Detail = detail,
            Instance = httpContext.Request.Path
        };

        httpContext.Response.StatusCode = statusCode;
        return httpContext.Response.WriteAsJsonAsync(problemDetails, cancellationToken: cancellationToken);
    }
}
