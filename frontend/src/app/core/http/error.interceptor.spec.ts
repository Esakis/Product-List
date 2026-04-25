import { TestBed } from '@angular/core/testing';
import { errorInterceptor } from './error.interceptor';

describe('errorInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('is defined', () => {
    expect(errorInterceptor).toBeDefined();
  });

  xit('shows validation message on 400', () => {});
  xit('shows duplicate code message on 409', () => {});
  xit('shows unreachable message on status 0', () => {});
  xit('shows server error message on 500', () => {});
});
