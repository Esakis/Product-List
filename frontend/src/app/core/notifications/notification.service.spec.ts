import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { NotificationService } from './notification.service';

describe('NotificationService', () => {
  let service: NotificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NotificationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('publishes a success notification', () => {
    service.success('Saved');

    const items = service.notifications();
    expect(items.length).toBe(1);
    expect(items[0].kind).toBe('success');
    expect(items[0].message).toBe('Saved');
  });

  it('publishes an error notification', () => {
    service.error('Boom');

    const items = service.notifications();
    expect(items.length).toBe(1);
    expect(items[0].kind).toBe('error');
    expect(items[0].message).toBe('Boom');
  });

  it('auto-dismisses notifications after the timeout', fakeAsync(() => {
    service.success('Saved');
    expect(service.notifications().length).toBe(1);

    tick(4000);

    expect(service.notifications().length).toBe(0);
  }));

  it('dismisses a notification by id', () => {
    service.success('A');
    service.error('B');
    const [first, second] = service.notifications();

    service.dismiss(first.id);

    expect(service.notifications()).toEqual([second]);
  });

  it('assigns unique incremental ids', () => {
    service.success('A');
    service.success('B');
    service.success('C');

    const ids = service.notifications().map(n => n.id);
    expect(new Set(ids).size).toBe(3);
  });
});
