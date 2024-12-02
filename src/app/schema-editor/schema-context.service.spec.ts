import { TestBed } from '@angular/core/testing';

import { SchemaContextService } from './schema-context.service';

describe('SchemaContextService', () => {
  let service: SchemaContextService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SchemaContextService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
