import {Injectable} from '@angular/core';
import {Response} from '../shared/model/response.interface';
import {SchemaSection} from '../shared/model/schema.interface';
import {SchemaKind, SchemaService} from '../shared/services/schema.service';
import {BehaviorSubject, filter, Observable, tap} from 'rxjs';

@Injectable()
export class SchemaContextService {
  kind: SchemaKind = 'preAudit';
  schema: SchemaSection[] = [];

  loaded = new BehaviorSubject(false);

  constructor(
    private schemaService: SchemaService,
  ) {
  }

  get loaded$() {
    return this.loaded.pipe(filter(Boolean));
  }

  save(section: SchemaSection): Observable<Response<SchemaSection>> {
    return this.schemaService.updateSchemaSection(this.kind, section.id, section).pipe(
      tap(() => section._dirty = false),
    );
  }
}
