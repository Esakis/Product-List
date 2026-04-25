import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { ProductService } from './product.service';
import { environment } from '../../environments/environment';
import { CreateProductRequest, Product } from './product.model';

describe('ProductService', () => {
  let service: ProductService;
  let httpMock: HttpTestingController;
  const productsUrl = `${environment.apiBaseUrl}/products`;

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
