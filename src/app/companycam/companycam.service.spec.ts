import { TestBed } from '@angular/core/testing';

import { CompanycamService } from './companycam.service';

describe('CompanycamService', () => {
  let service: CompanycamService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CompanycamService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
