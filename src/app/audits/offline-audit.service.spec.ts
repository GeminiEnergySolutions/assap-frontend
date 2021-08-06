import { TestBed } from '@angular/core/testing';

import { OfflineAuditService } from './offline-audit.service';

describe('OfflineAuditService', () => {
  let service: OfflineAuditService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OfflineAuditService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
