import {HttpClient} from '@angular/common/http';
import {inject, Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';
import {Audit} from '../shared/model/audit.interface';
import {Response} from '../shared/model/response.interface';

@Injectable({providedIn: 'root'})
export class DashboardService {
  private readonly http = inject(HttpClient);

  getDataSummary(stateId?: number): Observable<Response<SummaryResult[]>> {
    return this.http.get<Response<SummaryResult[]>>(`${environment.url}api/energyAudit/summarizeData`, {
      params: stateId ? {stateId} : {},
    });
  }
}

export interface SummaryResult {
  'stateId': number;
  'state_name': string;
  'GHG_emissions_savings': number;
  'kBTU_per_year_savings': number;
  'cost_per_year_savings': number;
  'included_audits': Pick<Audit, 'auditId' | 'auditName'>[];
  'excluded_audits': Pick<Audit, 'auditId' | 'auditName'>[];
}
