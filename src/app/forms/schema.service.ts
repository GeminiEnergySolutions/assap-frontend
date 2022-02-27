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
    return this.parseService.findAll<Schema>('Form', {type, subtype}, {
      keys,
      order: ['updatedAt'],
    }).pipe(
      map(schemas => {
        if (keys && !(keys.includes('type' as K) || !keys.includes('subtype' as K))) {
          return schemas;
        }

        const mapped = new Map<string, Schema>(schemas.map(s => [s.type + '/' + s.subtype, s]));
        return Array.from(mapped.values());
      }),
      tap(schemas => {
        if (keys) {
          return;
        }
        for (let schema of schemas) {
          this.saveLocal(schema);
        }
      }),
      catchError(() => of(this.getAllLocal(type, subtype))),
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

  private getAllLocal(type?: string, subtype?: string | null): Schema[] {
    const result: Schema[] = [];
    const pattern: RegExp = /^schemas\/([^\/]*)(?:\/([^\/]*))?$/;
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)!;
      if (!key.startsWith('schemas/')) { // faster than regex
        continue;
      }

      const match = pattern.exec(key);
      if (!match) {
        continue;
      }

      const [, _type, _subtype] = match;
      if (_subtype === 'updatedAt') {
        continue;
      }
      if (type !== undefined && _type !== type) {
        continue;
      }
      if (subtype === null && _subtype) {
        continue;
      }
      if (subtype !== undefined && _subtype !== subtype) {
        continue;
      }

      const value = localStorage.getItem(key);
      if (!value) {
        continue;
      }

      const schema = JSON.parse(value);
      result.push(schema);
    }
    return result;
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
