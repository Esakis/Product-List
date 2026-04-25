import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'app-error-banner',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './error-banner.component.html',
  styleUrl: './error-banner.component.scss'
})
export class ErrorBannerComponent {
  readonly message = input.required<string>();
  readonly retryLabel = input<string | null>('Retry');
  readonly retry = output<void>();

  onRetry(): void {
    this.retry.emit();
  }
}
