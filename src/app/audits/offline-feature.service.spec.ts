import { TestBed } from '@angular/core/testing';

import { OfflineFeatureService } from './offline-feature.service';

describe('OfflineFeatureService', () => {
  let service: OfflineFeatureService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OfflineFeatureService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
