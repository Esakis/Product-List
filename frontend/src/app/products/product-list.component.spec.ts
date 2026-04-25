import { TestBed } from '@angular/core/testing';
import { ProductListComponent } from './product-list.component';

describe('ProductListComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductListComponent]
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(ProductListComponent);
    fixture.componentRef.setInput('products', []);
    expect(fixture.componentInstance).toBeTruthy();
  });

  xit('renders empty state when products are empty', () => {});
  xit('renders a card per product', () => {});
  xit('formats the price as PLN', () => {});
});
