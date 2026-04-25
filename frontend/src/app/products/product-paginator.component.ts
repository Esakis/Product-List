import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';

@Component({
  selector: 'app-product-paginator',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './product-paginator.component.html',
  styleUrl: './product-paginator.component.scss'
})
export class ProductPaginatorComponent {
  readonly page = input.required<number>();
  readonly pageSize = input.required<number>();
  readonly total = input.required<number>();

  readonly pageChange = output<number>();

  readonly totalPages = computed(() => {
    const size = this.pageSize();
    if (size <= 0) {
      return 1;
    }
    return Math.max(1, Math.ceil(this.total() / size));
  });

  readonly hasResults = computed(() => this.total() > 0);
  readonly canGoPrevious = computed(() => this.page() > 1);
  readonly canGoNext = computed(() => this.page() < this.totalPages());

  goPrevious(): void {
    if (this.canGoPrevious()) {
      this.pageChange.emit(this.page() - 1);
    }
  }

  goNext(): void {
    if (this.canGoNext()) {
      this.pageChange.emit(this.page() + 1);
    }
  }
}
