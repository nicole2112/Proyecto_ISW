import { TestBed } from '@angular/core/testing';

import { DigitadorConfGuard } from './digitador-conf.guard';

describe('DigitadorConfGuard', () => {
  let guard: DigitadorConfGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(DigitadorConfGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
