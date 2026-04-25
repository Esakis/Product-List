using FluentValidation.TestHelper;
using ProductList.Api.Models;
using ProductList.Api.Validators;

namespace ProductList.Api.Tests.Validators;

public sealed class ProductQueryRequestValidatorTests
{
    private readonly ProductQueryRequestValidator _validator = new();

    [Fact]
    public void Default_request_passes_validation()
    {
        var request = new ProductQueryRequest(null, null);

        var result = _validator.TestValidate(request);

        result.ShouldNotHaveAnyValidationErrors();
    }

    [Fact]
    public void Whitespace_only_filters_pass_validation()
    {
        var request = new ProductQueryRequest("   ", "   ");

        var result = _validator.TestValidate(request);

        result.ShouldNotHaveAnyValidationErrors();
    }

    [Fact]
    public void Code_filter_longer_than_fifty_characters_is_rejected()
    {
        var request = new ProductQueryRequest(new string('A', 51), null);

        var result = _validator.TestValidate(request);

        result.ShouldHaveValidationErrorFor(r => r.Code);
    }

    [Theory]
    [InlineData("PRD 001")]
    [InlineData("PRD_001")]
    [InlineData("PRD.001")]
    public void Code_filter_with_unsupported_characters_is_rejected(string code)
    {
        var request = new ProductQueryRequest(code, null);

        var result = _validator.TestValidate(request);

        result.ShouldHaveValidationErrorFor(r => r.Code);
    }

    [Fact]
    public void Name_filter_longer_than_two_hundred_characters_is_rejected()
    {
        var request = new ProductQueryRequest(null, new string('A', 201));

        var result = _validator.TestValidate(request);

        result.ShouldHaveValidationErrorFor(r => r.Name);
    }

    [Theory]
    [InlineData(0)]
    [InlineData(-1)]
    public void Page_below_one_is_rejected(int page)
    {
        var request = new ProductQueryRequest(null, null, page);

        var result = _validator.TestValidate(request);

        result.ShouldHaveValidationErrorFor(r => r.Page);
    }

    [Theory]
    [InlineData(0)]
    [InlineData(101)]
    public void PageSize_outside_one_to_hundred_is_rejected(int pageSize)
    {
        var request = new ProductQueryRequest(null, null, 1, pageSize);

        var result = _validator.TestValidate(request);

        result.ShouldHaveValidationErrorFor(r => r.PageSize);
    }
}
