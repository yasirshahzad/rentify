import { TestBed } from '@angular/core/testing';

import { AdminAuthGauardService } from './admin-auth-gauard.service';

describe('AdminAuthGauardService', () => {
  let service: AdminAuthGauardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdminAuthGauardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
