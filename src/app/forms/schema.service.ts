import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {catchError, map, tap} from 'rxjs/operators';
import {ParseService} from '../parse/parse.service';
import {Schema, SchemaId} from './schema';

@Injectable({
  providedIn: 'root',
})
export class SchemaService {

  constructor(
    private http: HttpClient,
    private parseService: ParseService,
  ) {
  }

  loadSchemas<K extends keyof Schema>(type?: string, subtype?: string | null, keys?: K[]): Observable<Pick<Schema, K>[]> {
    return this.parseService.findAll<Schema>('Form', {type, subtype}, {keys}).pipe(
      tap(schemas => {
        if (keys) {
          return;
        }
        for (let schema of schemas) {
          this.saveLocal(schema);
        }
      }),
      // TODO catchError load local
    );
  }

  loadSchema(id: SchemaId): Observable<Schema | undefined> {
    const {type, subtype} = id;
    return this.parseService.findAll<Schema>('Form', {type, subtype}, {
      limit: 1,
      order: ['-updatedAt'],
    }).pipe(
      map(schemas => {
        if (schemas.length === 0) {
          return undefined;
        } else {
          const schema = schemas[0];
          this.saveLocal(schema);
          return schema;
        }
      }),
      catchError(() => of(this.getLocal(id))),
    );
  }

  private getKey({type, subtype}: SchemaId): string {
    return `schemas/${type}${subtype ? '/' + subtype: ''}`;
  }

  private getLocal(id: SchemaId): Schema | undefined {
    const local = localStorage.getItem(this.getKey(id));
    return local ? JSON.parse(local) : undefined;
  }

  private saveLocal(schema: Schema) {
    const {updatedAt} = schema;
    const updatedLocal = localStorage.getItem(`${this.getKey(schema)}/updatedAt`);
    if (!updatedLocal || updatedLocal < updatedAt) {
      localStorage.setItem(this.getKey(schema), JSON.stringify(schema));
      localStorage.setItem(`${this.getKey(schema)}/updatedAt`, updatedAt);
    }
  }
}
