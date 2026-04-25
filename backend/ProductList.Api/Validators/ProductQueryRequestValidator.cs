using FluentValidation;
using ProductList.Api.Models;

namespace ProductList.Api.Validators;

public sealed class ProductQueryRequestValidator : AbstractValidator<ProductQueryRequest>
{
    private const int CodeMaxLength = 50;
    private const int NameMaxLength = 200;
    private const int MinPage = 1;
    private const int MinPageSize = 1;
    private const int MaxPageSize = 100;
    private const string CodePattern = "^[A-Za-z0-9\\-]+$";

    public ProductQueryRequestValidator()
    {
        When(request => !string.IsNullOrWhiteSpace(request.Code), () =>
        {
            RuleFor(request => request.Code!)
                .MaximumLength(CodeMaxLength).WithMessage($"Code filter must be at most {CodeMaxLength} characters long.")
                .Matches(CodePattern).WithMessage("Code filter may contain only letters, digits and hyphens.");
        });

        When(request => !string.IsNullOrWhiteSpace(request.Name), () =>
        {
            RuleFor(request => request.Name!)
                .MaximumLength(NameMaxLength).WithMessage($"Name filter must be at most {NameMaxLength} characters long.");
        });

        RuleFor(request => request.Page)
            .GreaterThanOrEqualTo(MinPage).WithMessage($"Page must be at least {MinPage}.");

        RuleFor(request => request.PageSize)
            .InclusiveBetween(MinPageSize, MaxPageSize).WithMessage($"PageSize must be between {MinPageSize} and {MaxPageSize}.");
    }
}
