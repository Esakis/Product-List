import { TestBed } from '@angular/core/testing';
import { NotificationHostComponent } from './notification-host.component';

describe('NotificationHostComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotificationHostComponent]
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(NotificationHostComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  xit('renders notifications from the service', () => {});
  xit('dismisses a notification on click', () => {});
});
