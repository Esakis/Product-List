import { TestBed } from '@angular/core/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { errorInterceptor } from './error.interceptor';
import { NotificationService } from '../notifications/notification.service';

describe('errorInterceptor', () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;
  let notifications: jasmine.SpyObj<NotificationService>;

  beforeEach(() => {
    notifications = jasmine.createSpyObj<NotificationService>('NotificationService', ['error', 'success']);

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([errorInterceptor])),
        provideHttpClientTesting(),
        { provide: NotificationService, useValue: notifications }
      ]
    });

    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('is defined', () => {
    expect(errorInterceptor).toBeDefined();
  });

  it('shows a flattened validation message on 400', () => {
    http.post('/api/x', {}).subscribe({ error: () => undefined });
    httpMock.expectOne('/api/x').flush(
      { errors: { Code: ['Code is required.'], Price: ['Price must be at least 0.01.'] } },
      { status: 400, statusText: 'Bad Request' }
    );

    expect(notifications.error).toHaveBeenCalledTimes(1);
    const message = notifications.error.calls.mostRecent().args[0] as string;
    expect(message).toContain('Validation error');
    expect(message).toContain('Code is required.');
    expect(message).toContain('Price must be at least 0.01.');
  });

  it('falls back to detail when 400 has no errors map', () => {
    http.post('/api/x', {}).subscribe({ error: () => undefined });
    httpMock.expectOne('/api/x').flush(
      { detail: 'Invalid payload.' },
      { status: 400, statusText: 'Bad Request' }
    );

    expect(notifications.error).toHaveBeenCalledWith('Validation error: Invalid payload.');
  });

  it('shows the detail message from server on 409', () => {
    http.post('/api/x', {}).subscribe({ error: () => undefined });
    httpMock.expectOne('/api/x').flush(
      { detail: "A product with code 'PRD-001' already exists." },
      { status: 409, statusText: 'Conflict' }
    );

    expect(notifications.error).toHaveBeenCalledWith("A product with code 'PRD-001' already exists.");
  });

  it('shows a fallback conflict message on 409 when detail is absent', () => {
    http.post('/api/x', {}).subscribe({ error: () => undefined });
    httpMock.expectOne('/api/x').flush({}, { status: 409, statusText: 'Conflict' });

    expect(notifications.error).toHaveBeenCalledWith('A product with this Code or Name already exists.');
  });

  it('shows the unreachable message on status 0', () => {
    http.get('/api/x').subscribe({ error: () => undefined });
    httpMock.expectOne('/api/x').error(new ProgressEvent('error'), { status: 0, statusText: 'Unknown Error' });

    expect(notifications.error).toHaveBeenCalledWith('Unable to reach the server.');
  });

  it('shows the server error message on 500', () => {
    http.get('/api/x').subscribe({ error: () => undefined });
    httpMock.expectOne('/api/x').flush({}, { status: 500, statusText: 'Server Error' });

    expect(notifications.error).toHaveBeenCalledWith('An unexpected server error occurred.');
  });

  it('rethrows the error so callers still observe it', done => {
    http.get('/api/x').subscribe({
      error: error => {
        expect(error.status).toBe(500);
        done();
      }
    });
    httpMock.expectOne('/api/x').flush({}, { status: 500, statusText: 'Server Error' });
  });
});
