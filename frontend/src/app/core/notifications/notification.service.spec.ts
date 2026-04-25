import { TestBed } from '@angular/core/testing';
import { NotificationService } from './notification.service';

describe('NotificationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service = TestBed.inject(NotificationService);
    expect(service).toBeTruthy();
  });

  xit('publishes success notification', () => {});
  xit('publishes error notification', () => {});
  xit('auto-dismisses after timeout', () => {});
  xit('dismisses by id', () => {});
});
