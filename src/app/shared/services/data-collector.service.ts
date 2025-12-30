import {HttpClient} from '@angular/common/http';
import {inject, Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {Response} from '../model/response.interface';
import {User} from '../model/user.interface';

@Injectable({providedIn: 'root'})
export class DataCollectorService {
  private http = inject(HttpClient);

  getDataCollectors(auditId: number, type: 'assigned' | 'unassigned' = 'assigned'): Observable<Response<User[]>> {
    return this.http.get<Response<User[]>>(`/api/audit/${auditId}/dataCollector`, {
      params: {type},
    });
  }

  assignDataCollectors(auditId: number, ids: number[]): Observable<Response> {
    return this.http.post<Response>(`/api/audit/${auditId}/dataCollector`, ids);
  }

  deleteDataCollectors(auditId: number, ids: number[]): Observable<Response> {
    return this.http.delete<Response>(`/api/audit/${auditId}/dataCollector`, {body: ids});
  }
}
