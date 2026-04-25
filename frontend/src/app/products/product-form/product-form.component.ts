import { ChangeDetectionStrategy, Component, DestroyRef, inject, output, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';

import { NotificationService } from '../../core/notifications/notification.service';
import { Product } from '../product.model';
import { ProductService } from '../product.service';

const CODE_PATTERN = /^[A-Za-z0-9\-]+$/;
const CODE_MAX_LENGTH = 50;
const NAME_MAX_LENGTH = 200;
const PRICE_MIN = 0.01;
const PRICE_MAX = 1_000_000;

const twoDecimalsValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const value = control.value;
  if (value === null || value === undefined || value === '') {
    return null;
  }
  const asString = String(value);
  if (!/^\d+(\.\d{1,2})?$/.test(asString)) {
    return { twoDecimals: true };
  }
  return null;
};

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.scss'
})
export class ProductFormComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly productService = inject(ProductService);
  private readonly notifications = inject(NotificationService);
  private readonly destroyRef = inject(DestroyRef);

  readonly productAdded = output<Product>();
  readonly submitting = signal(false);

  readonly form = this.formBuilder.nonNullable.group({
    code: ['', [Validators.required, Validators.maxLength(CODE_MAX_LENGTH), Validators.pattern(CODE_PATTERN)]],
    name: ['', [Validators.required, Validators.maxLength(NAME_MAX_LENGTH)]],
    price: [
      null as number | null,
      [Validators.required, Validators.min(PRICE_MIN), Validators.max(PRICE_MAX), twoDecimalsValidator]
    ]
  });

  get codeControl(): AbstractControl {
    return this.form.controls.code;
  }

  get nameControl(): AbstractControl {
    return this.form.controls.name;
  }

  get priceControl(): AbstractControl {
    return this.form.controls.price;
  }

  submit(): void {
    if (this.form.invalid || this.submitting()) {
      this.form.markAllAsTouched();
      return;
    }

    const raw = this.form.getRawValue();
    const payload = {
      code: raw.code.trim(),
      name: raw.name.trim(),
      price: Number(raw.price)
    };

    this.submitting.set(true);
    this.productService
      .create(payload)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: created => {
          this.submitting.set(false);
          this.form.reset({ code: '', name: '', price: null });
          this.notifications.success('Product added.');
          this.productAdded.emit(created);
        },
        error: () => {
          this.submitting.set(false);
        }
      });
  }

  isFieldInvalid(control: AbstractControl): boolean {
    return control.invalid && (control.dirty || control.touched);
  }
}
