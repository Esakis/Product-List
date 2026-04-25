import { TestBed } from '@angular/core/testing';
import { ErrorBannerComponent } from './error-banner.component';

describe('ErrorBannerComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ErrorBannerComponent]
    }).compileComponents();
  });

  it('renders the provided message', () => {
    const fixture = TestBed.createComponent(ErrorBannerComponent);
    fixture.componentRef.setInput('message', 'Something went wrong');
    fixture.detectChanges();

    const host: HTMLElement = fixture.nativeElement;
    expect(host.querySelector('.error-banner__message')?.textContent).toBe('Something went wrong');
  });

  it('emits retry when the retry button is clicked', () => {
    const fixture = TestBed.createComponent(ErrorBannerComponent);
    fixture.componentRef.setInput('message', 'Boom');
    fixture.detectChanges();
    let retried = false;
    fixture.componentInstance.retry.subscribe(() => (retried = true));

    (fixture.nativeElement as HTMLElement).querySelector<HTMLButtonElement>('.error-banner__retry')!.click();

    expect(retried).toBeTrue();
  });

  it('hides the retry button when retryLabel is null', () => {
    const fixture = TestBed.createComponent(ErrorBannerComponent);
    fixture.componentRef.setInput('message', 'Boom');
    fixture.componentRef.setInput('retryLabel', null);
    fixture.detectChanges();

    expect((fixture.nativeElement as HTMLElement).querySelector('.error-banner__retry')).toBeNull();
  });
});
