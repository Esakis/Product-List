import { TestBed } from '@angular/core/testing';
import { ErrorBannerComponent } from './error-banner.component';

describe('ErrorBannerComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ErrorBannerComponent]
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(ErrorBannerComponent);
    fixture.componentRef.setInput('message', 'Something went wrong');
    expect(fixture.componentInstance).toBeTruthy();
  });

  xit('renders the provided message', () => {});
  xit('emits retry on button click', () => {});
  xit('hides retry button when retryLabel is null', () => {});
});
