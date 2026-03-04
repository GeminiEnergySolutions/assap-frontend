import {HttpClient, HttpResponse} from '@angular/common/http';
import {inject, Injectable} from '@angular/core';
import {catchError, EMPTY, map, Observable, of, switchMap} from 'rxjs';
import {environment} from 'src/environments/environment';
import {Audit, AuditDetails, CreateAuditDto, UpdateAuditDto} from '../model/audit.interface';
import {PercentageCompletion} from '../model/percentage-completion.interface';
import {CreatePreAuditData, PreAuditData} from '../model/pre-audit-data.interface';
import {CreateReportDto, FilterReportsDto, Report, UpdateReportDto} from '../model/report.interface';
import {Response} from '../model/response.interface';

export type PercentageQuery =
  | { progressType: 'complete', auditId: number }
  | { progressType: 'preAudit', auditId: number }
  | { progressType: 'ceh', auditId: number }
  | { progressType: 'grants', auditId: number }
  | { progressType: 'equipment', auditId: number, zoneId: number, equipmentId: number }
  | { progressType: 'equipmentForm', auditId: number, zoneId: number, subTypeId: number }
  | { progressType: 'zone', auditId: number }
  | { progressType: 'zone', auditId: number, zoneId: number }
  | { progressType: 'zoneDetails', auditId: number, zoneId: number }


@Injectable({
  providedIn: 'root',
})
export class AuditService {
  private http = inject(HttpClient);

  currentProgress?: PercentageCompletion;

  getPercentage(params: PercentageQuery): Observable<PercentageCompletion> {
    return this.http.get<Response<PercentageCompletion>>(`${environment.api}/formData/progress`, {
      params,
    }).pipe(map(({data}) => data));
  }

  getSingleAudit(id: number): Observable<Response<Audit>> {
    return this.http.get<Response<Audit>>(`${environment.api}/audit/${id}`);
  }
  getAllAudit(): Observable<Response<Audit[]>> {
    return this.http.get<Response<Audit[]>>(`${environment.api}/audit`);
  }
  createAudit(data: CreateAuditDto): Observable<Response<Audit>> {
    return this.http.post<Response<Audit>>(`${environment.api}/audit`, data);
  }
  updateAudit(id: number, data: UpdateAuditDto): Observable<Response<Audit>> {
    return this.http.put<Response<Audit>>(`${environment.api}/audit/${id}`, data);
  }
  deleteAudit(id: number): Observable<Response> {
    return this.http.delete<Response>(`${environment.api}/audit/${id}`);
  }

  getAuditDetails(id: number): Observable<Response<AuditDetails>> {
    return this.http.get<Response<AuditDetails>>(`${environment.api}/audit/${id}/details`);
  }

  getGrantsData(auditId: number): Observable<Response<PreAuditData>> {
    return this.http.get<Response<PreAuditData>>(`${environment.api}/formData/audit/${auditId}/grants`);
  }
  createGrantsData(auditId: number, formData: CreatePreAuditData): Observable<Response<PreAuditData>> {
    return this.http.post<Response<PreAuditData>>(`${environment.api}/formData/audit/${auditId}/grants`, formData);
  }
  updateGrantsData(auditId: number, formData: PreAuditData): Observable<Response<PreAuditData>> {
    return this.http.put<Response<PreAuditData>>(`${environment.api}/formData/audit/${auditId}/grants`, formData);
  }

  getCleanEnergyHubData(auditId: number): Observable<Response<PreAuditData>> {
    return this.http.get<Response<PreAuditData>>(`${environment.api}/formData/audit/${auditId}/ceh`);
  }
  createCleanEnergyHubData(auditId: number, formData: CreatePreAuditData): Observable<Response<PreAuditData>> {
    return this.http.post<Response<PreAuditData>>(`${environment.api}/formData/audit/${auditId}/ceh`, formData);
  }
  updateCleanEnergyHubData(auditId: number, formData: PreAuditData): Observable<Response<PreAuditData>> {
    return this.http.put<Response<PreAuditData>>(`${environment.api}/formData/audit/${auditId}/ceh`, formData);
  }

  getPreAuditData(auditId: number): Observable<Response<PreAuditData>> {
    return this.http.get<Response<PreAuditData>>(`${environment.api}/formData/audit/${auditId}/preAudit`);
  }
  createPreAuditData(auditId: number, formData: CreatePreAuditData): Observable<Response<PreAuditData>> {
    return this.http.post<Response<PreAuditData>>(`${environment.api}/formData/audit/${auditId}/preAudit`, formData);
  }
  updatePreAuditData(auditId: number, formData: PreAuditData): Observable<Response<PreAuditData>> {
    return this.http.put<Response<PreAuditData>>(`${environment.api}/formData/audit/${auditId}/preAudit`, formData);
  }

  generateReport(dto: CreateReportDto): Observable<Response<null>> {
    const {file, ...rest} = dto;
    return this.http.post<Response<null>>(`${environment.api}/reports`, rest);
  }
  uploadReport(dto: CreateReportDto, file: File): Observable<Report> {
    return this.http.post<Response<Report & {upload_url: string}>>(`${environment.api}/reports`, {...dto, file: file.name}).pipe(
      switchMap(({data}) => this.http.put(data.upload_url, file).pipe(
        map(() => 'uploaded' as const),
        catchError(() => of('failed' as const)),
        switchMap(upload_status => this.updateReport(data.id, {
          // mark the new report as uploaded or failed
          upload_status,
        }).pipe(
          // PATCH response is not meaningful {data: null}, return the original POST response + new upload_status.
          map(() => ({...data, upload_status})),
        )),
      )),
    );
  }

  getReports(params?: FilterReportsDto): Observable<Response<{ reports: Report[]; count_total_reports: number; }>> {
    return this.http.get<Response<{
      reports: Report[];
      count_total_reports: number;
    }>>(`${environment.api}/reports`, {params: {...params}});
  }
  headReport(report: Report): Observable<HttpResponse<void>> {
    return report.head ? this.http.head<void>(report.head, {
      observe: 'response',
    }) : EMPTY;
  }
  getReport(id: number): Observable<Response<Report>> {
    return this.http.get<Response<Report>>(`${environment.api}/reports/${id}`);
  }
  updateReport(id: number, dto: UpdateReportDto): Observable<Response> {
    return this.http.patch<Response>(`${environment.api}/reports/${id}`, dto);
  }
  deleteReport(id: number): Observable<Response> {
    return this.http.delete<Response>(`${environment.api}/reports/${id}`);
  }
}
