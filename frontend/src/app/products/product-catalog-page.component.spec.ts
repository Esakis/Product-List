import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { Subject, of, throwError } from 'rxjs';

import { ProductCatalogPageComponent } from './product-catalog-page.component';
import { ProductService } from './product.service';
import { Product } from './product.model';

describe('ProductCatalogPageComponent', () => {
  let productService: jasmine.SpyObj<ProductService>;

  beforeEach(async () => {
    productService = jasmine.createSpyObj<ProductService>('ProductService', ['getAll', 'create']);

    await TestBed.configureTestingModule({
      imports: [ProductCatalogPageComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: ProductService, useValue: productService }
      ]
    }).compileComponents();
  });

  function createComponent() {
    const fixture = TestBed.createComponent(ProductCatalogPageComponent);
    return { fixture, component: fixture.componentInstance };
  }

  it('should create', () => {
    productService.getAll.and.returnValue(of([]));
    const { component } = createComponent();
    expect(component).toBeTruthy();
  });

  it('loads products on init and exposes them sorted as returned', () => {
    const products: Product[] = [
      { id: 1, code: 'PRD-001', name: 'Apple', price: 1 },
      { id: 2, code: 'PRD-002', name: 'Banana', price: 2 }
    ];
    productService.getAll.and.returnValue(of(products));

    const { component } = createComponent();

    expect(productService.getAll).toHaveBeenCalledTimes(1);
    expect(component.products()).toEqual(products);
    expect(component.loading()).toBeFalse();
    expect(component.error()).toBeNull();
  });

  it('keeps loading=true until the request completes', () => {
    const subject = new Subject<Product[]>();
    productService.getAll.and.returnValue(subject.asObservable());

    const { component } = createComponent();

    expect(component.loading()).toBeTrue();
    subject.next([]);
    subject.complete();
    expect(component.loading()).toBeFalse();
  });

  it('sets an error message when loading fails', () => {
    productService.getAll.and.returnValue(throwError(() => new Error('boom')));

    const { component } = createComponent();

    expect(component.loading()).toBeFalse();
    expect(component.error()).toBe('Unable to load products.');
  });

  it('appends an added product and re-sorts by name', () => {
    const initial: Product[] = [
      { id: 1, code: 'PRD-001', name: 'Apple', price: 1 },
      { id: 3, code: 'PRD-003', name: 'Zebra', price: 3 }
    ];
    productService.getAll.and.returnValue(of(initial));
    const { component } = createComponent();

    component.onProductAdded({ id: 2, code: 'PRD-002', name: 'Mango', price: 2 });

    expect(component.products().map(p => p.name)).toEqual(['Apple', 'Mango', 'Zebra']);
  });

  it('reload() re-issues the request', () => {
    productService.getAll.and.returnValue(of([]));
    const { component } = createComponent();
    productService.getAll.calls.reset();

    component.reload();

    expect(productService.getAll).toHaveBeenCalledTimes(1);
  });
});
