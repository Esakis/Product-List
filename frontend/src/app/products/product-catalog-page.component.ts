import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { ErrorBannerComponent } from '../shared/ui/error-banner.component';
import { SpinnerComponent } from '../shared/ui/spinner.component';
import { ProductFormComponent } from './product-form.component';
import { ProductListComponent } from './product-list.component';
import { Product } from './product.model';
import { ProductService } from './product.service';

@Component({
  selector: 'app-product-catalog-page',
  standalone: true,
  imports: [
    SpinnerComponent,
    ErrorBannerComponent,
    ProductFormComponent,
    ProductListComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './product-catalog-page.component.html',
  styleUrl: './product-catalog-page.component.scss'
})
export class ProductCatalogPageComponent {
  private readonly productService = inject(ProductService);
  private readonly destroyRef = inject(DestroyRef);

  readonly products = signal<Product[]>([]);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  constructor() {
    this.loadProducts();
  }

  onProductAdded(product: Product): void {
    this.products.update(existing => this.appendAndSortByName(existing, product));
  }

  reload(): void {
    this.loadProducts();
  }

  private loadProducts(): void {
    this.loading.set(true);
    this.error.set(null);

    this.productService
      .getAll()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: items => {
          this.products.set(items);
          this.loading.set(false);
        },
        error: () => {
          this.error.set('Unable to load products.');
          this.loading.set(false);
        }
      });
  }

  private appendAndSortByName(existing: Product[], added: Product): Product[] {
    return [...existing, added].sort((a, b) => a.name.localeCompare(b.name));
  }
}
