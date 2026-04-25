import { TestBed } from '@angular/core/testing';
import { ProductListComponent } from './product-list.component';
import { Product } from '../product.model';

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

  it('renders the empty state when there are no products', () => {
    const fixture = TestBed.createComponent(ProductListComponent);
    fixture.componentRef.setInput('products', []);
    fixture.detectChanges();

    const host: HTMLElement = fixture.nativeElement;
    expect(host.querySelector('app-empty-state')).not.toBeNull();
    expect(host.querySelectorAll('.product-card').length).toBe(0);
  });

  it('renders one card per product', () => {
    const products: Product[] = [
      { id: 1, code: 'PRD-001', name: 'Coffee', price: 10 },
      { id: 2, code: 'PRD-002', name: 'Tea', price: 20 }
    ];
    const fixture = TestBed.createComponent(ProductListComponent);
    fixture.componentRef.setInput('products', products);
    fixture.detectChanges();

    const host: HTMLElement = fixture.nativeElement;
    expect(host.querySelector('app-empty-state')).toBeNull();
    expect(host.querySelectorAll('.product-card').length).toBe(2);
    expect(host.textContent).toContain('Coffee');
    expect(host.textContent).toContain('PRD-002');
  });

  it('formats the price as PLN with two decimal places', () => {
    const fixture = TestBed.createComponent(ProductListComponent);
    fixture.componentRef.setInput('products', [
      { id: 1, code: 'PRD-001', name: 'Coffee', price: 49.9 }
    ]);
    fixture.detectChanges();

    const priceText = (fixture.nativeElement as HTMLElement).querySelector('.product-card__price')?.textContent ?? '';
    expect(priceText).toMatch(/49[.,]90/);
    expect(priceText.toLowerCase()).toMatch(/pln|zł/);
  });
});
