import { TestBed } from '@angular/core/testing';

import { ParseAuditService } from './parse-audit.service';

describe('ParseAuditService', () => {
  let service: ParseAuditService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ParseAuditService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
