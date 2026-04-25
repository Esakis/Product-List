import { TestBed } from '@angular/core/testing';
import { NotificationHostComponent } from './notification-host.component';
import { NotificationService } from '../notification.service';

describe('NotificationHostComponent', () => {
  let notifications: NotificationService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotificationHostComponent]
    }).compileComponents();
    notifications = TestBed.inject(NotificationService);
  });

  it('renders one entry per notification published by the service', () => {
    const fixture = TestBed.createComponent(NotificationHostComponent);
    notifications.success('First');
    notifications.error('Second');
    fixture.detectChanges();

    const host: HTMLElement = fixture.nativeElement;
    const items = host.querySelectorAll('.notification');
    expect(items.length).toBe(2);
    expect(host.textContent).toContain('First');
    expect(host.textContent).toContain('Second');
  });

  it('dismisses a notification when its close button is clicked', () => {
    const fixture = TestBed.createComponent(NotificationHostComponent);
    notifications.success('Bye');
    fixture.detectChanges();

    (fixture.nativeElement as HTMLElement).querySelector<HTMLButtonElement>('.notification__close')!.click();
    fixture.detectChanges();

    expect((fixture.nativeElement as HTMLElement).querySelectorAll('.notification').length).toBe(0);
  });
});
