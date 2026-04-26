import { ChangeDetectionStrategy, Component, DestroyRef, inject, input, output, signal } from '@angular/core';

const CODE_MAX_LENGTH = 50;
const NAME_MAX_LENGTH = 200;
const CODE_PATTERN = '[A-Za-z0-9\\-]*';
const CLEAR_FADE_DURATION_MS = 400;

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
  readonly clearFadeDurationMs = CLEAR_FADE_DURATION_MS;
  readonly isClearing = signal(false);

  private readonly destroyRef = inject(DestroyRef);
  private pendingClearTimeoutId: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    this.destroyRef.onDestroy(() => this.cancelPendingClear());
  }

  onCodeInput(value: string): void {
    this.filterChange.emit({ code: value, name: this.name() });
  }

  onNameInput(value: string): void {
    this.filterChange.emit({ code: this.code(), name: value });
  }

  clear(): void {
    if (this.isClearing()) {
      return;
    }
    if (!this.code() && !this.name()) {
      return;
    }
    this.isClearing.set(true);
    this.pendingClearTimeoutId = setTimeout(() => {
      this.filterChange.emit({ code: '', name: '' });
      this.isClearing.set(false);
      this.pendingClearTimeoutId = null;
    }, CLEAR_FADE_DURATION_MS);
  }

  hasActiveFilters(): boolean {
    return this.code().length > 0 || this.name().length > 0;
  }

  private cancelPendingClear(): void {
    if (this.pendingClearTimeoutId !== null) {
      clearTimeout(this.pendingClearTimeoutId);
      this.pendingClearTimeoutId = null;
    }
  }
}
