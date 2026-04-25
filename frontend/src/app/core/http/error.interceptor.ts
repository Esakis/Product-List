import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { NotificationService } from '../notifications/notification.service';

const DUPLICATE_CODE_MESSAGE = 'A product with this Code already exists.';
const UNREACHABLE_MESSAGE = 'Unable to reach the server.';
const SERVER_ERROR_MESSAGE = 'An unexpected server error occurred.';
const VALIDATION_PREFIX = 'Validation error';

export const errorInterceptor: HttpInterceptorFn = (request, next) => {
  const notifications = inject(NotificationService);

  return next(request).pipe(
    catchError((error: HttpErrorResponse) => {
      notifications.error(mapErrorToMessage(error));
      return throwError(() => error);
    })
  );
};

function mapErrorToMessage(error: HttpErrorResponse): string {
  if (error.status === 0) {
    return UNREACHABLE_MESSAGE;
  }
  if (error.status === 400) {
    return buildValidationMessage(error);
  }
  if (error.status === 409) {
    return DUPLICATE_CODE_MESSAGE;
  }
  return SERVER_ERROR_MESSAGE;
}

function buildValidationMessage(error: HttpErrorResponse): string {
  const errors = error.error?.errors;
  if (errors && typeof errors === 'object') {
    const flattened = Object.values(errors as Record<string, string[]>)
      .flat()
      .filter((value): value is string => typeof value === 'string' && value.length > 0);
    if (flattened.length > 0) {
      return `${VALIDATION_PREFIX}: ${flattened.join(' ')}`;
    }
  }
  const detail = typeof error.error?.detail === 'string' ? error.error.detail : undefined;
  const title = typeof error.error?.title === 'string' ? error.error.title : undefined;
  return `${VALIDATION_PREFIX}: ${detail ?? title ?? 'The request could not be validated.'}`;
}
