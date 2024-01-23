import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastService } from 'ng-bootstrap-ext';
import { Observable, map, throwError } from 'rxjs';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root',
})
export class AuditService {
  rootUrl = environment.url;
  
  progressPercent ?: string = '0%';
  progressPercentCEH ?: string = '0%';
  equipmentHeadingValue: string = '';
  progressPercentageEquipment ?: string = '0%';
  progressPercentageZone ?: string = '0%';
  equipmentTotalFields ?: string = '0';
  equipmentRemainingFields ?: string ='0';
  zoneTotalFields ?: string = '0';
  zoneRemainingFields ?: string = '0';
  isCompleted: boolean = true;

  constructor(private http: HttpClient,
    private toaster: ToastService,
    ) {}

  calculatePercentage(auditId: number):Observable<any> {
    return this.http.get(`${this.rootUrl}api/percentageCompletion/${auditId}/`);
  }
  getEquipmentTypesPercentage(aid: number, zid: number, eid: string): Observable<any> {
    return this.http.get(`${this.rootUrl}api/equipmentType/equipment/${aid}/${zid}/${eid}/`);
  }
  calculatePercentageEquipment(auditId: number,subId: number,zoneId:number ):Observable<any> {
    return this.http.get(`${this.rootUrl}api/percentageCompletionEquipment/${auditId}/${subId}/${zoneId}/`);
  }
  calculatePercentageZone(auditId: number, zoneId: number ):Observable<any> {
    return this.http.get(`${this.rootUrl}api/PercentageZone/${auditId}/${zoneId}/`);
  }
  
  dataCollectors(auditId: number):Observable<any> {
    return this.http.get(`${this.rootUrl}authApi/v1/data-collectors?auditId=${auditId}`);
  }
  assignAudits(data: any[]):Observable<any> {
    return this.http.post(`${this.rootUrl}api/assign/`,data);
  }

  getPhotos(auditId: Number): Observable<any> {
    return this.http.get(`${this.rootUrl}api/auditPhoto?auditId=${auditId}`);
  }
  uploadPhoto(auditId: Number, formData: any): Observable<any> {
    return this.http.post(`${this.rootUrl}api/auditPhoto?auditId=${auditId}`, formData);
  }
  // getPhotosFilter(auditId: Number,equipmentId: Number): Observable<any> {
  //   return this.http.get(`${this.rootUrl}api/equipment_photos/audit/${auditId}/equipmentId/${equipmentId}/`);
  // }
  
  // uploadEnergyAuditFileData(formData: any): Observable<any> {
  //   return this.http.post(`${this.rootUrl}api/energyauditfile/`, formData);
  // }
  // getCleanEnergyHubFileData(auditId: Number): Observable<any> {
  //   return this.http.get(`${this.rootUrl}api/cleanenergyhubfiles/${auditId}/`);
  // }
  // createCleanEnergyHubFileData(formData: any, auditId: Number): Observable<any> {
  //   return this.http.post(`${this.rootUrl}api/cleanenergyhubfiles/${auditId}/`, formData);
  // }
  // updateCleanEnergyHubFileData(formData: any, auditId: Number): Observable<any> {
  //   return this.http.put(`${this.rootUrl}api/cleanenergyhubfiles/${auditId}/`, formData);
  // }

  // getUtilityInfo(auditId: number) {
  //   return this.http.get(`${this.rootUrl}api/auditutilityinfo/${auditId}/`);
  // }
  // createUtilityInfo(auditId: number, objData: any) {
  //   return this.http.post(
  //     `${this.rootUrl}api/auditutilityinfo/${auditId}/`,
  //     objData
  //   );
  // }
  // updateUtilityInfo(auditId: number, objData: any) {
  //   return this.http.put(
  //     `${this.rootUrl}api/auditutilityinfo/${auditId}/`,
  //     objData
  //   );
  // }

  // auditEnergyReport(auditId: number): Observable<Blob | any> {
  //   return this.http.get(`${this.rootUrl}api/energyAuditReport/${auditId}/`, { observe: 'response', responseType: 'blob' }).pipe(
  //     map((response: any) => {
  //       const contentType = response.headers.get('Content-Type') || '';
  //       const isJsonResponse = contentType.includes('application/json');

  //       if (isJsonResponse) {
  //         const body = JSON.parse(response.body || '{}');
  //         this.toaster.error(body.message || '{}', 'Error');
  //         console.log('end')
  //         return throwError(response.body.message);
  //       } else {
  //         return response.body as Blob;
  //       }
  //     })
  //   );
  // }
  // feasibilityReport(auditId: number): Observable<Blob | any> {
  //   return this.http.get(`${this.rootUrl}api/feasibilityReport/${auditId}/`, { observe: 'response', responseType: 'text' });
  // }
  // cehReport(auditId: number): Observable<any> {
  //   return this.http.get(`${this.rootUrl}api/cehMicrogridSheet/${auditId}/`, { observe: 'response', responseType: 'text' });
  // }

  scrapping(auditId: number): Observable<any> {
    return this.http.get(
      `${this.rootUrl}api/scrapping/${auditId}/`
    );
  }

  auditEnergyReport(auditId: number): Observable<Blob | any> {
    return this.http.get(`${this.rootUrl}api/energyAuditReport/${auditId}/`);
  }
  feasibilityReport(auditId: number): Observable<Blob | any> {
    return this.http.get(`${this.rootUrl}api/feasibilityReport/${auditId}/`);
  }
  cehReport(auditId: number): Observable<any> {
    return this.http.get(`${this.rootUrl}api/cehMicrogridSheet/${auditId}/`);
  }

  getSingleAudit(auditId: number): Observable<any> {
    return this.http.get(`${this.rootUrl}api/audit?auditId=${auditId}`);
  }
  getAllAudit(): Observable<any> {
    return this.http.get(`${this.rootUrl}api/audit`);
  }
  createAudit(data: any): Observable<any> {
    return this.http.post(`${this.rootUrl}api/audit`, data);
  }
  updateAudit(data: any): Observable<any> {
    return this.http.put(`${this.rootUrl}api/audit?auditId=${data.auditId}`, data);
  }
  deleteAudit(id: number): Observable<any> {
    return this.http.delete(`${this.rootUrl}api/audit?auditId=${id}`);
  }

  getAllDataCollectorAudit(): Observable<any> {
    return this.http.get(`${this.rootUrl}api/dataCollectorAudits`);
  }
  // createAuditDataCollector(data: any): Observable<any> {
  //   return this.http.post(`${this.rootUrl}api/dataCollectorAudits`, data);
  // }

  getAuditorInfo(auditId: Number): Observable<any> {
    return this.http.get(`${this.rootUrl}api/preAuditAuditorInfo/${auditId}/`);
  }
  createAuditorInfo(auditId: Number, data: any): Observable<any> {
    return this.http.post(`${this.rootUrl}api/preAuditAuditorInfo/${auditId}/`, data);
  }
  updateAuditorInfo(auditId: Number, data: any): Observable<any> {
    return this.http.put(`${this.rootUrl}api/preAuditAuditorInfo/${auditId}/`, data);
  }

  getGeneralInfo(auditId: Number): Observable<any> {
    return this.http.get(`${this.rootUrl}api/preAuditGeneralClientInfo/${auditId}/`);
  }
  createGeneralInfo(auditId: Number, data: any): Observable<any> {
    return this.http.post(`${this.rootUrl}api/preAuditGeneralClientInfo/${auditId}/`, data);
  }
  updateGeneralInfo(auditId: Number, data: any): Observable<any> {
    return this.http.put(`${this.rootUrl}api/preAuditGeneralClientInfo/${auditId}/`, data);
  }

  getPreAuditInterviewee(auditId: Number): Observable<any> {
    return this.http.get(`${this.rootUrl}api/preAuditInterviewee/${auditId}/`);
  }
  createPreAuditInterviewee(auditId: Number, data: any): Observable<any> {
    return this.http.post(`${this.rootUrl}api/preAuditInterviewee/${auditId}/`, data);
  }
  updatePreAuditInterviewee(auditId: Number, data: any): Observable<any> {
    return this.http.put(`${this.rootUrl}api/preAuditInterviewee/${auditId}/`, data);
  }

  getPreAuditOperationHours(auditId: Number): Observable<any> {
    return this.http.get(`${this.rootUrl}api/preAuditOperationHours/${auditId}/`);
  }
  createPreAuditOperationHours(auditId: Number, data: any): Observable<any> {
    return this.http.post(`${this.rootUrl}api/preAuditOperationHours/${auditId}/`, data);
  }
  updatePreAuditOperationHours(auditId: Number, data: any): Observable<any> {
    return this.http.put(`${this.rootUrl}api/preAuditOperationHours/${auditId}/`, data);
  }

  getPreAuditArea(auditId: Number): Observable<any> {
    return this.http.get(`${this.rootUrl}api/preAuditArea/${auditId}/`);
  }
  createPreAuditArea(auditId: Number, data: any): Observable<any> {
    return this.http.post(`${this.rootUrl}api/preAuditArea/${auditId}/`, data);
  }
  updatePreAuditArea(auditId: Number, data: any): Observable<any> {
    return this.http.put(`${this.rootUrl}api/preAuditArea/${auditId}/`, data);
  }

  getPreAuditAge(auditId: Number): Observable<any> {
    return this.http.get(`${this.rootUrl}api/preAuditAge/${auditId}/`);
  }
  createPreAuditAge(auditId: Number, data: any): Observable<any> {
    return this.http.post(`${this.rootUrl}api/preAuditAge/${auditId}/`, data);
  }
  updatePreAuditAge(auditId: Number, data: any): Observable<any> {
    return this.http.put(`${this.rootUrl}api/preAuditAge/${auditId}/`, data);
  }

  getPreaAditHVACMaintainence(auditId: Number): Observable<any> {
    return this.http.get(`${this.rootUrl}api/preAuditHVACMaintainence/${auditId}/`);
  }
  createPreaAditHVACMaintainence(auditId: Number, data: any): Observable<any> {
    return this.http.post(`${this.rootUrl}api/preAuditHVACMaintainence/${auditId}/`, data);
  }
  updatePreaAditHVACMaintainence(auditId: Number, data: any): Observable<any> {
    return this.http.put(`${this.rootUrl}api/preAuditHVACMaintainence/${auditId}/`, data);
  }

  getPreAuditOther(auditId: Number): Observable<any> {
    return this.http.get(`${this.rootUrl}api/preAuditOther/${auditId}/`);
  }
  createPreAuditOther(auditId: Number, data: any): Observable<any> {
    return this.http.post(`${this.rootUrl}api/preAuditOther/${auditId}/`, data);
  }
  updatePreAuditOther(auditId: Number, data: any): Observable<any> {
    return this.http.put(`${this.rootUrl}api/preAuditOther/${auditId}/`, data);
  }

  getPreAuditGeneralSiteAccessNotes(auditId: Number): Observable<any> {
    return this.http.get(`${this.rootUrl}api/preAuditGeneralSiteAccessNotes/${auditId}/`);
  }
  createPreAuditGeneralSiteAccessNotes(auditId: Number, data: any): Observable<any> {
    return this.http.post(`${this.rootUrl}api/preAuditGeneralSiteAccessNotes/${auditId}/`, data);
  }
  updatePreAuditGeneralSiteAccessNotes(auditId: Number, data: any): Observable<any> {
    return this.http.put(`${this.rootUrl}api/preAuditGeneralSiteAccessNotes/${auditId}/`, data);
  }

  getUtillityBillAnalysis(auditId: Number): Observable<any> {
    return this.http.get(`${this.rootUrl}api/preAuditUtilityBillAnalysis/${auditId}/`);
  }
  createUtillityBillAnalysis(auditId: Number, data: any): Observable<any> {
    return this.http.post(`${this.rootUrl}api/preAuditUtilityBillAnalysis/${auditId}/`, data);
  }
  updateUtillityBillAnalysis(auditId: Number, data: any): Observable<any> {
    return this.http.put(`${this.rootUrl}api/preAuditUtilityBillAnalysis/${auditId}/`, data);
  }

  getGrantsData(auditId: number): Observable<any> {
    return this.http.get(`${this.rootUrl}api/grantdata/${auditId}/`);
  }
  createGrantsData(auditId: number, formData: any): Observable<any> {
    return this.http.post(`${this.rootUrl}api/grantdata/${auditId}/`, formData);
  }
  updateGrantsData(auditId: number, formData: any): Observable<any> {
    return this.http.put(`${this.rootUrl}api/grantdata/${auditId}/`, formData);
  }
  getGrantsJsonSchema(): Observable<any> {
    return this.http.get(`${this.rootUrl}api/grantschema/`);
  }

  getCleanEnergyHubData(auditId: number): Observable<any> {
    return this.http.get(`${this.rootUrl}api/cleanenergyhubdata/${auditId}/`);
  }
  createCleanEnergyHubData(auditId: number, formData: any): Observable<any> {
    return this.http.post(`${this.rootUrl}api/cleanenergyhubdata/${auditId}/`, formData);
  }
  updateCleanEnergyHubData(auditId: number, formData: any): Observable<any> {
    return this.http.put(`${this.rootUrl}api/cleanenergyhubdata/${auditId}/`, formData);
  }
  getCleanEnergyHubJsonSchema(): Observable<any> {
    return this.http.get(`${this.rootUrl}api/cleanenergyhubschema/`);
  }

  getPreAuditJsonSchema(): Observable<any> {
    return this.http.get(`${this.rootUrl}api/preAuditSchema/`);
  }
  getPreAuditData(auditId: number): Observable<any> {
    return this.http.get(`${this.rootUrl}api/preAuditFormData/${auditId}/`);
  }
  createPreAuditData(auditId: number, formData: any): Observable<any> {
    return this.http.post(`${this.rootUrl}api/preAuditFormData/${auditId}/`, formData);
  }
  updatePreAuditData(auditId: number, formData: any): Observable<any> {
    return this.http.put(`${this.rootUrl}api/preAuditFormData/${auditId}/`, formData);
  }
}
