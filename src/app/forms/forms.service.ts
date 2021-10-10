import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {switchMap} from 'rxjs/operators';
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

  loadSchema(name: string): Observable<Schema> {
    return this.parseService.findAll<Schema>('Form', {name}, {
      limit: 1,
      order: ['-updatedAt'],
    }).pipe(
      switchMap(schemas => schemas.length ? of(schemas[0]) : this.http.get<Schema>(`/assets/${name}.json`)),
    );
  }
}
