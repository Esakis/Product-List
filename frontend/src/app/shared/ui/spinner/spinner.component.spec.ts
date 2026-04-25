import { TestBed } from '@angular/core/testing';
import { SpinnerComponent } from './spinner.component';

describe('SpinnerComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpinnerComponent]
    }).compileComponents();
  });

  it('renders the default label', () => {
    const fixture = TestBed.createComponent(SpinnerComponent);
    fixture.detectChanges();

    const text = (fixture.nativeElement as HTMLElement).querySelector('.spinner__label')?.textContent ?? '';
    expect(text).toBe('Loading...');
  });

  it('renders a custom label via input', () => {
    const fixture = TestBed.createComponent(SpinnerComponent);
    fixture.componentRef.setInput('label', 'Loading products...');
    fixture.detectChanges();

    const text = (fixture.nativeElement as HTMLElement).querySelector('.spinner__label')?.textContent ?? '';
    expect(text).toBe('Loading products...');
  });
});
