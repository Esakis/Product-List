import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { ProductService } from './product.service';
import { environment } from '../../environments/environment';
import { CreateProductRequest, PagedResult, Product, ProductQuery } from './product.model';

describe('ProductService', () => {
  let service: ProductService;
  let httpMock: HttpTestingController;
  const productsUrl = `${environment.apiBaseUrl}/products`;
  const searchUrl = `${productsUrl}/search`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });
    service = TestBed.inject(ProductService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getAll() issues a GET to /products and returns the body', () => {
    const expected: Product[] = [
      { id: 1, code: 'PRD-001', name: 'Coffee', price: 49.99 },
      { id: 2, code: 'PRD-002', name: 'Tea', price: 24.5 }
    ];

    let received: Product[] | undefined;
    service.getAll().subscribe(items => (received = items));

    const request = httpMock.expectOne(productsUrl);
    expect(request.request.method).toBe('GET');
    request.flush(expected);

    expect(received).toEqual(expected);
  });

  it('search() omits empty code and name parameters', () => {
    const query: ProductQuery = { code: '', name: '', page: 1, pageSize: 20 };
    const response: PagedResult<Product> = { items: [], total: 0, page: 1, pageSize: 20 };

    service.search(query).subscribe();

    const request = httpMock.expectOne(req => req.url === searchUrl);
    expect(request.request.method).toBe('GET');
    expect(request.request.params.has('code')).toBeFalse();
    expect(request.request.params.has('name')).toBeFalse();
    expect(request.request.params.get('page')).toBe('1');
    expect(request.request.params.get('pageSize')).toBe('20');
    request.flush(response);
  });

  it('search() trims and includes code and name when provided', () => {
    const query: ProductQuery = { code: '  PRD  ', name: '  cof  ', page: 2, pageSize: 10 };
    const response: PagedResult<Product> = { items: [], total: 0, page: 2, pageSize: 10 };

    service.search(query).subscribe();

    const request = httpMock.expectOne(req => req.url === searchUrl);
    expect(request.request.params.get('code')).toBe('PRD');
    expect(request.request.params.get('name')).toBe('cof');
    expect(request.request.params.get('page')).toBe('2');
    expect(request.request.params.get('pageSize')).toBe('10');
    request.flush(response);
  });

  it('search() returns the paged result body', () => {
    const query: ProductQuery = { code: '', name: '', page: 1, pageSize: 20 };
    const expected: PagedResult<Product> = {
      items: [{ id: 1, code: 'PRD-001', name: 'Coffee', price: 49.99 }],
      total: 1,
      page: 1,
      pageSize: 20
    };

    let received: PagedResult<Product> | undefined;
    service.search(query).subscribe(value => (received = value));

    const request = httpMock.expectOne(req => req.url === searchUrl);
    request.flush(expected);

    expect(received).toEqual(expected);
  });

  it('create() issues a POST to /products with the request body and returns the created product', () => {
    const payload: CreateProductRequest = { code: 'PRD-100', name: 'New', price: 12.34 };
    const created: Product = { id: 99, ...payload };

    let received: Product | undefined;
    service.create(payload).subscribe(product => (received = product));

    const request = httpMock.expectOne(productsUrl);
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual(payload);
    request.flush(created);

    expect(received).toEqual(created);
  });
});
