import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { ProductFormComponent } from './product-form.component';

describe('ProductFormComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductFormComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()]
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(ProductFormComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  xit('blocks submit when form is invalid', () => {});
  xit('rejects code with invalid characters', () => {});
  xit('rejects price with more than two decimals', () => {});
  xit('emits productAdded on successful create', () => {});
});
