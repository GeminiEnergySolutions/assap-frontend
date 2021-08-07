import { TestBed } from '@angular/core/testing';

import { ParseFeatureService } from './parse-feature.service';

describe('ParseFeatureService', () => {
  let service: ParseFeatureService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ParseFeatureService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
