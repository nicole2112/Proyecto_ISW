import { TestBed } from '@angular/core/testing';

import { AdminConfGuard } from './admin-conf.guard';

describe('AdminConfGuard', () => {
  let guard: AdminConfGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(AdminConfGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
