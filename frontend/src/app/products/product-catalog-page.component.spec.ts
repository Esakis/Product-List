import { provideZoneChangeDetection } from '@angular/core';
import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { Subject, of, throwError } from 'rxjs';

import { ProductCatalogPageComponent } from './product-catalog-page.component';
import { ProductService } from './product.service';
import { PagedResult, Product } from './product.model';

const FILTER_DEBOUNCE_MS = 300;

function pagedResult(items: Product[], total = items.length, page = 1, pageSize = 20): PagedResult<Product> {
  return { items, total, page, pageSize };
}

describe('ProductCatalogPageComponent', () => {
  let productService: jasmine.SpyObj<ProductService>;
  let router: jasmine.SpyObj<Router>;
  let routeQueryParamMap: ReturnType<typeof convertToParamMap>;

  function setQueryParams(params: Record<string, string>): void {
    routeQueryParamMap = convertToParamMap(params);
  }

  async function configure(): Promise<void> {
    await TestBed.configureTestingModule({
      imports: [ProductCatalogPageComponent],
      providers: [
        provideZoneChangeDetection({ eventCoalescing: true }),
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: ProductService, useValue: productService },
        { provide: Router, useValue: router },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { get queryParamMap() { return routeQueryParamMap; } } }
        }
      ]
    }).compileComponents();
  }

  beforeEach(() => {
    productService = jasmine.createSpyObj<ProductService>('ProductService', ['getAll', 'create', 'search']);
    router = jasmine.createSpyObj<Router>('Router', ['navigate']);
    router.navigate.and.resolveTo(true);
    setQueryParams({});
  });

  function createComponent() {
    const fixture = TestBed.createComponent(ProductCatalogPageComponent);
    fixture.detectChanges();
    return { fixture, component: fixture.componentInstance };
  }

  it('issues an initial search with seed defaults from URL params', fakeAsync(async () => {
    setQueryParams({ code: 'PRD', name: 'cof', page: '2', pageSize: '10' });
    productService.search.and.returnValue(of(pagedResult([], 0, 2, 10)));
    await configure();

    const { component } = createComponent();
    tick(FILTER_DEBOUNCE_MS);

    expect(component.code()).toBe('PRD');
    expect(component.name()).toBe('cof');
    expect(component.page()).toBe(2);
    expect(component.pageSize()).toBe(10);
    expect(productService.search).toHaveBeenCalledTimes(1);
    expect(productService.search.calls.mostRecent().args[0]).toEqual({
      code: 'PRD',
      name: 'cof',
      page: 2,
      pageSize: 10
    });
  }));

  it('exposes products and total from the search result', fakeAsync(async () => {
    const items: Product[] = [{ id: 1, code: 'PRD-001', name: 'Coffee', price: 49.99 }];
    productService.search.and.returnValue(of(pagedResult(items, 1)));
    await configure();

    const { component } = createComponent();
    tick(FILTER_DEBOUNCE_MS);

    expect(component.products()).toEqual(items);
    expect(component.total()).toBe(1);
    expect(component.loading()).toBeFalse();
    expect(component.error()).toBeNull();
  }));

  it('keeps loading=true until the first search emits', fakeAsync(async () => {
    const subject = new Subject<PagedResult<Product>>();
    productService.search.and.returnValue(subject.asObservable());
    await configure();

    const { fixture, component } = createComponent();
    tick(FILTER_DEBOUNCE_MS);

    expect(component.loading()).toBeTrue();
    subject.next(pagedResult([]));
    fixture.detectChanges();
    expect(component.loading()).toBeFalse();
  }));

  it('sets an error message when the search fails', fakeAsync(async () => {
    productService.search.and.returnValue(throwError(() => new Error('boom')));
    await configure();

    const { component } = createComponent();
    tick(FILTER_DEBOUNCE_MS);

    expect(component.loading()).toBeFalse();
    expect(component.error()).toBe('Unable to load products.');
  }));

  it('debounces filter changes and resets page to 1 when filters change', fakeAsync(async () => {
    productService.search.and.returnValue(of(pagedResult([])));
    await configure();
    const { component } = createComponent();
    tick(FILTER_DEBOUNCE_MS);

    component.onFilterChange({ code: '', name: 'cof' });
    tick(FILTER_DEBOUNCE_MS - 1);
    const callsBeforeDebounce = productService.search.calls.count();
    tick(1);
    const callsAfterDebounce = productService.search.calls.count();

    expect(callsAfterDebounce).toBeGreaterThan(callsBeforeDebounce);
    expect(component.page()).toBe(1);
    expect(productService.search.calls.mostRecent().args[0]).toEqual({
      code: '',
      name: 'cof',
      page: 1,
      pageSize: 20
    });
  }));

  it('refetches with the current filter when a product is added', fakeAsync(async () => {
    productService.search.and.returnValue(of(pagedResult([])));
    await configure();
    const { component } = createComponent();
    tick(FILTER_DEBOUNCE_MS);
    productService.search.calls.reset();

    component.onProductAdded();
    tick(FILTER_DEBOUNCE_MS);

    expect(productService.search).toHaveBeenCalledTimes(1);
  }));

  it('syncs the URL with current filter and pagination', fakeAsync(async () => {
    productService.search.and.returnValue(of(pagedResult([])));
    await configure();
    const { component } = createComponent();
    tick(FILTER_DEBOUNCE_MS);
    router.navigate.calls.reset();

    component.onFilterChange({ code: 'PRD', name: 'cof' });
    tick(FILTER_DEBOUNCE_MS);

    const lastNavigate = router.navigate.calls.mostRecent();
    expect(lastNavigate.args[1]?.queryParams).toEqual(jasmine.objectContaining({
      code: 'PRD',
      name: 'cof',
      page: 1,
      pageSize: 20
    }));
    expect(lastNavigate.args[1]?.replaceUrl).toBeTrue();
  }));

  it('omits empty code and name from the URL', fakeAsync(async () => {
    productService.search.and.returnValue(of(pagedResult([])));
    await configure();
    const { component } = createComponent();
    tick(FILTER_DEBOUNCE_MS);

    component.onFilterChange({ code: '', name: '' });
    tick(FILTER_DEBOUNCE_MS);

    const lastNavigate = router.navigate.calls.mostRecent();
    expect(lastNavigate.args[1]?.queryParams).toEqual(jasmine.objectContaining({
      code: null,
      name: null
    }));
  }));

  it('reload() triggers a refetch', fakeAsync(async () => {
    productService.search.and.returnValue(of(pagedResult([])));
    await configure();
    const { component } = createComponent();
    tick(FILTER_DEBOUNCE_MS);
    productService.search.calls.reset();

    component.reload();
    tick(FILTER_DEBOUNCE_MS);

    expect(productService.search).toHaveBeenCalledTimes(1);
  }));
});
