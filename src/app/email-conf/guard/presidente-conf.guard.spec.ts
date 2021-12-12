import { TestBed } from '@angular/core/testing';

import { PresidenteConfGuard } from './presidente-conf.guard';

describe('PresidenteConfGuard', () => {
  let guard: PresidenteConfGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(PresidenteConfGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
