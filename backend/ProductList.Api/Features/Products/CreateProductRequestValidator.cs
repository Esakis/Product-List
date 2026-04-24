using FluentValidation;

namespace ProductList.Api.Features.Products;

public sealed class CreateProductRequestValidator : AbstractValidator<CreateProductRequest>
{
    private const int CodeMaxLength = 50;
    private const int NameMaxLength = 200;
    private const decimal MinPrice = 0.01m;
    private const decimal MaxPrice = 1_000_000m;
    private const string CodePattern = "^[A-Za-z0-9\\-]+$";

    public CreateProductRequestValidator()
    {
        RuleFor(request => request.Code)
            .NotEmpty().WithMessage("Code is required.")
            .MaximumLength(CodeMaxLength).WithMessage($"Code must be at most {CodeMaxLength} characters long.")
            .Matches(CodePattern).WithMessage("Code may contain only letters, digits and hyphens.");

        RuleFor(request => request.Name)
            .NotEmpty().WithMessage("Name is required.")
            .MaximumLength(NameMaxLength).WithMessage($"Name must be at most {NameMaxLength} characters long.");

        RuleFor(request => request.Price)
            .GreaterThanOrEqualTo(MinPrice).WithMessage($"Price must be at least {MinPrice}.")
            .LessThanOrEqualTo(MaxPrice).WithMessage($"Price must be at most {MaxPrice}.")
            .Must(HasAtMostTwoDecimalPlaces).WithMessage("Price must have at most two decimal places.");
    }

    private static bool HasAtMostTwoDecimalPlaces(decimal price)
    {
        return decimal.Round(price, 2) == price;
    }
}
