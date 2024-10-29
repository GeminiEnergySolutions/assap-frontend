import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {SchemaResponse} from '../model/schema.interface';
import {environment} from '../../../environments/environment.prod';
import {HttpClient} from '@angular/common/http';

type SchemaKind = 'preAudit' | 'ceh' | 'grants' | 'zone' | `equipment/${number}`;

@Injectable({providedIn: 'root'})
export class SchemaService {
  constructor(
    private http: HttpClient,
  ) {
  }

  getSchema(kind: SchemaKind): Observable<SchemaResponse> {
    return this.http.get<SchemaResponse>(`${environment.url}api/schemas/${kind}`);
  }
}
