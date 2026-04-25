import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CurrencyPipe } from '@angular/common';

import { EmptyStateComponent } from '../../shared/ui/empty-state/empty-state.component';
import { Product } from '../product.model';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CurrencyPipe, EmptyStateComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss'
})
export class ProductListComponent {
  readonly products = input.required<Product[]>();
  readonly emptyTitle = input<string>('No products yet');
  readonly emptyDescription = input<string>('Add the first product to see it appear here.');
}
