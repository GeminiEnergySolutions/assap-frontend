import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {Response} from '../model/response.interface';
import {User} from '../model/user.interface';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';

@Injectable({providedIn: 'root'})
export class DataCollectorService {
  constructor(
    private http: HttpClient,
  ) {
  }

  getDataCollectors(auditId: number, type: 'assigned' | 'unassigned' = 'assigned'): Observable<Response<User[]>> {
    return this.http.get<Response<User[]>>(`${environment.url}api/audit/${auditId}/dataCollector`, {
      params: {type},
    });
  }

  assignDataCollectors(auditId: number, ids: number[]): Observable<Response> {
    return this.http.post<Response>(`${environment.url}api/audit/${auditId}/dataCollector`, ids);
  }

  deleteDataCollectors(auditId: number, ids: number[]): Observable<Response> {
    return this.http.delete<Response>(`${environment.url}api/audit/${auditId}/dataCollector`, {body: ids});
  }
}
