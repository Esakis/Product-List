using FluentAssertions;
using FluentValidation.TestHelper;
using ProductList.Api.Models;
using ProductList.Api.Validators;

namespace ProductList.Api.Tests.Validators;

public sealed class CreateProductRequestValidatorTests
{
    private readonly CreateProductRequestValidator _validator = new();

    [Fact]
    public void Valid_request_passes_validation()
    {
        var request = new CreateProductRequest("PRD-100", "Sample Product", 12.34m);

        var result = _validator.TestValidate(request);

        result.ShouldNotHaveAnyValidationErrors();
    }

    [Theory]
    [InlineData("")]
    [InlineData("   ")]
    public void Code_is_required(string code)
    {
        var request = new CreateProductRequest(code, "Sample", 1.00m);

        var result = _validator.TestValidate(request);

        result.ShouldHaveValidationErrorFor(r => r.Code);
    }

    [Fact]
    public void Code_longer_than_fifty_characters_is_rejected()
    {
        var code = new string('A', 51);
        var request = new CreateProductRequest(code, "Sample", 1.00m);

        var result = _validator.TestValidate(request);

        result.ShouldHaveValidationErrorFor(r => r.Code)
            .WithErrorMessage("Code must be at most 50 characters long.");
    }

    [Theory]
    [InlineData("PRD 001")]
    [InlineData("PRD_001")]
    [InlineData("PRD.001")]
    [InlineData("PRDą01")]
    public void Code_with_unsupported_characters_is_rejected(string code)
    {
        var request = new CreateProductRequest(code, "Sample", 1.00m);

        var result = _validator.TestValidate(request);

        result.ShouldHaveValidationErrorFor(r => r.Code)
            .WithErrorMessage("Code may contain only letters, digits and hyphens.");
    }

    [Fact]
    public void Name_is_required()
    {
        var request = new CreateProductRequest("PRD-001", "", 1.00m);

        var result = _validator.TestValidate(request);

        result.ShouldHaveValidationErrorFor(r => r.Name)
            .WithErrorMessage("Name is required.");
    }

    [Fact]
    public void Name_longer_than_two_hundred_characters_is_rejected()
    {
        var name = new string('A', 201);
        var request = new CreateProductRequest("PRD-001", name, 1.00m);

        var result = _validator.TestValidate(request);

        result.ShouldHaveValidationErrorFor(r => r.Name);
    }

    [Theory]
    [InlineData(0)]
    [InlineData(-1)]
    [InlineData(0.001)]
    public void Price_below_minimum_is_rejected(decimal price)
    {
        var request = new CreateProductRequest("PRD-001", "Sample", price);

        var result = _validator.TestValidate(request);

        result.ShouldHaveValidationErrorFor(r => r.Price);
    }

    [Fact]
    public void Price_above_maximum_is_rejected()
    {
        var request = new CreateProductRequest("PRD-001", "Sample", 1_000_000.01m);

        var result = _validator.TestValidate(request);

        result.ShouldHaveValidationErrorFor(r => r.Price);
    }

    [Theory]
    [InlineData(12.345)]
    [InlineData(0.999)]
    public void Price_with_more_than_two_decimal_places_is_rejected(decimal price)
    {
        var request = new CreateProductRequest("PRD-001", "Sample", price);

        var result = _validator.TestValidate(request);

        result.ShouldHaveValidationErrorFor(r => r.Price)
            .WithErrorMessage("Price must have at most two decimal places.");
    }
}
