import { TestBed } from '@angular/core/testing';

import { EmailConfGuard } from './email-conf.guard';

describe('EmailConfGuard', () => {
  let guard: EmailConfGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(EmailConfGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
