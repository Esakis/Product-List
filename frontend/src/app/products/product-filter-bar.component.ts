import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

const CODE_MAX_LENGTH = 50;
const NAME_MAX_LENGTH = 200;
const CODE_PATTERN = '[A-Za-z0-9\\-]*';

export interface ProductFilterValues {
  code: string;
  name: string;
}

@Component({
  selector: 'app-product-filter-bar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './product-filter-bar.component.html',
  styleUrl: './product-filter-bar.component.scss'
})
export class ProductFilterBarComponent {
  readonly code = input<string>('');
  readonly name = input<string>('');

  readonly filterChange = output<ProductFilterValues>();

  readonly codeMaxLength = CODE_MAX_LENGTH;
  readonly nameMaxLength = NAME_MAX_LENGTH;
  readonly codePattern = CODE_PATTERN;

  onCodeInput(value: string): void {
    this.filterChange.emit({ code: value, name: this.name() });
  }

  onNameInput(value: string): void {
    this.filterChange.emit({ code: this.code(), name: value });
  }

  clear(): void {
    if (!this.code() && !this.name()) {
      return;
    }
    this.filterChange.emit({ code: '', name: '' });
  }

  hasActiveFilters(): boolean {
    return this.code().length > 0 || this.name().length > 0;
  }
}
