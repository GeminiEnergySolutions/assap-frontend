import {HttpClient} from '@angular/common/http';
import {inject, Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {Response} from '../shared/model/response.interface';
import {SummaryResult} from './summary.interface';

@Injectable({providedIn: 'root'})
export class DashboardService {
  private readonly http = inject(HttpClient);

  getDataSummary(stateId?: number): Observable<Response<SummaryResult[]>> {
    return this.http.get<Response<SummaryResult[]>>(`/api/energyAudit/summarizeData`, {
      params: stateId ? {stateId} : {},
    });
  }
}
