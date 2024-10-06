import {Injectable} from '@angular/core';
import {SchemaSection} from '../shared/model/schema.interface';

@Injectable()
export class SchemaContextService {
  schema: SchemaSection[] = [];
}
