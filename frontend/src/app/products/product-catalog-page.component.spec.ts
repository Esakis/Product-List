import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { ProductCatalogPageComponent } from './product-catalog-page.component';

describe('ProductCatalogPageComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductCatalogPageComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()]
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(ProductCatalogPageComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  xit('loads products on init', () => {});
  xit('shows spinner while loading', () => {});
  xit('shows error banner when load fails', () => {});
  xit('appends new product on productAdded event', () => {});
});
