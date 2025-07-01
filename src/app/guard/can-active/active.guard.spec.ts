import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { activeGuard } from './active.guard';

describe('activeGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => activeGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
