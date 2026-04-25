import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';

import { ProductFormComponent } from './product-form.component';
import { ProductService } from './product.service';
import { NotificationService } from '../core/notifications/notification.service';
import { Product } from './product.model';

describe('ProductFormComponent', () => {
  let productService: jasmine.SpyObj<ProductService>;
  let notifications: jasmine.SpyObj<NotificationService>;

  beforeEach(async () => {
    productService = jasmine.createSpyObj<ProductService>('ProductService', ['create', 'getAll']);
    notifications = jasmine.createSpyObj<NotificationService>('NotificationService', ['success', 'error']);

    await TestBed.configureTestingModule({
      imports: [ProductFormComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: ProductService, useValue: productService },
        { provide: NotificationService, useValue: notifications }
      ]
    }).compileComponents();
  });

  function createComponent(): ProductFormComponent {
    const fixture = TestBed.createComponent(ProductFormComponent);
    fixture.detectChanges();
    return fixture.componentInstance;
  }

  it('should create', () => {
    expect(createComponent()).toBeTruthy();
  });

  it('does not call the service when the form is invalid', () => {
    const component = createComponent();

    component.submit();

    expect(productService.create).not.toHaveBeenCalled();
  });

  it('rejects a code containing unsupported characters', () => {
    const component = createComponent();
    component.form.controls.code.setValue('PRD 001');

    expect(component.codeControl.errors?.['pattern']).toBeTruthy();
  });

  it('rejects a price with more than two decimal places', () => {
    const component = createComponent();
    component.form.controls.price.setValue(12.345);

    expect(component.priceControl.errors?.['twoDecimals']).toBeTruthy();
  });

  it('emits productAdded and shows a success toast on successful create', () => {
    const created: Product = { id: 5, code: 'PRD-005', name: 'Honey', price: 34 };
    productService.create.and.returnValue(of(created));
    const component = createComponent();
    component.form.setValue({ code: 'PRD-005', name: 'Honey', price: 34 });
    let emitted: Product | undefined;
    component.productAdded.subscribe(product => (emitted = product));

    component.submit();

    expect(productService.create).toHaveBeenCalledOnceWith({ code: 'PRD-005', name: 'Honey', price: 34 });
    expect(notifications.success).toHaveBeenCalledWith('Product added.');
    expect(emitted).toEqual(created);
    expect(component.submitting()).toBeFalse();
  });

  it('does not emit productAdded when the service errors', () => {
    productService.create.and.returnValue(throwError(() => new Error('boom')));
    const component = createComponent();
    component.form.setValue({ code: 'PRD-001', name: 'Coffee', price: 49.99 });
    let emitted: Product | undefined;
    component.productAdded.subscribe(product => (emitted = product));

    component.submit();

    expect(emitted).toBeUndefined();
    expect(component.submitting()).toBeFalse();
  });
});
