import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { ProductService } from './product.service';

describe('ProductService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });
  });

  it('should be created', () => {
    const service = TestBed.inject(ProductService);
    expect(service).toBeTruthy();
  });

  xit('getAll() issues GET to /products', () => {});
  xit('create() issues POST to /products with body', () => {});
});
