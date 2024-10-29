import {Injectable} from '@angular/core';
import {SchemaSection} from '../shared/model/schema.interface';
import {SchemaKind} from '../shared/services/schema.service';

@Injectable()
export class SchemaContextService {
  kind: SchemaKind = 'preAudit';
  schema: SchemaSection[] = [];
}
