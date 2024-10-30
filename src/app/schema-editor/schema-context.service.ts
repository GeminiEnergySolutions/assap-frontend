import {Injectable} from '@angular/core';
import {SchemaSection} from '../shared/model/schema.interface';
import {SchemaKind, SchemaService} from '../shared/services/schema.service';
import {map, Observable, tap} from 'rxjs';

@Injectable()
export class SchemaContextService {
  kind: SchemaKind = 'preAudit';
  schema: SchemaSection[] = [];

  constructor(
    private schemaService: SchemaService,
  ) {
  }

  save(section: SchemaSection): Observable<{}> {
    return this.schemaService.updateSchemaSection(this.kind, section.id, section).pipe(
      tap(() => section._dirty = false),
    );
  }
}
