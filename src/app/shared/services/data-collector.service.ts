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

  getUnassignedDataCollectors(auditId: number): Observable<Response<User[]>> {
    return this.http.get<Response<User[]>>(`${environment.url}authApi/v1/audit/${auditId}/dataCollectors/unassigned`);
  }

  assignDataCollectors(data: { auditId: number; dataCollectorId: number }[]): Observable<Response> {
    return this.http.post<Response>(`${environment.url}api/auditAssignment`, data);
  }
}
