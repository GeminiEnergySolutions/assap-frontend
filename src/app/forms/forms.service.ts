import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {catchError, map, tap} from 'rxjs/operators';
import {ParseService} from '../parse/parse.service';
import {Schema} from './forms.interface';

@Injectable({
  providedIn: 'root',
})
export class FormsService {

  constructor(
    private http: HttpClient,
    private parseService: ParseService,
  ) {
  }

  loadSchemas(): Observable<Schema[]> {
    return this.parseService.findAll<Schema>('Form').pipe(tap(schemas => {
      for (let schema of schemas) {
        this.saveLocal(schema);
      }
    }));
  }

  loadSchema(name: string): Observable<Schema | undefined> {
    return this.parseService.findAll<Schema>('Form', {name}, {
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
      catchError(() => of(this.getLocal(name))),
    );
  }

  private getLocal(name: string): Schema | undefined {
    const local = localStorage.getItem(`schemas/${name}`);
    return local ? JSON.parse(local) : undefined;
  }

  private saveLocal(schema: Schema) {
    const {name, updatedAt} = schema;
    const updatedLocal = localStorage.getItem(`schemas/${name}/updatedAt`);
    if (!updatedLocal || updatedLocal < updatedAt) {
      localStorage.setItem(`schemas/${name}`, JSON.stringify(schema));
      localStorage.setItem(`schemas/${name}/updatedAt`, updatedAt);
    }
  }
}
