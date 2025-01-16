import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {environment} from 'src/environments/environment.prod';
import {
  CreateEquipmentDto,
  CreateEquipmentFormData,
  Equipment,
  EquipmentCategory,
  EquipmentFormData,
  EquipmentType,
} from '../model/equipment.interface';
import {HvacConnectedZone, ZoneWithHvacConnected} from '../model/zone.interface';
import {Response} from '../model/response.interface';

@Injectable({providedIn: 'root'})
export class EquipmentService {

  constructor(
    private http: HttpClient,
  ) {
  }

  getEquipmentCategory(id: number): Observable<Response<EquipmentCategory>> {
    return this.http.get<Response<EquipmentCategory>>(`${environment.url}api/equipment/${id}`);
  }

  getEquipmentCategories(): Observable<Response<EquipmentCategory[]>> {
    return this.http.get<Response<EquipmentCategory[]>>(`${environment.url}api/equipment`);
  }

  getEquipmentType(categoryId: number, id: number): Observable<Response<EquipmentType>> {
    return this.http.get<Response<EquipmentType>>(`${environment.url}api/equipment/${categoryId}/type/${id}`);
  }

  getEquipmentTypes(categoryId: number): Observable<Response<EquipmentType[]>> {
    return this.http.get<Response<EquipmentType[]>>(`${environment.url}api/equipment/${categoryId}/type`);
  }

  getEquipment(zoneId: number, categoryId: number, id: number): Observable<Response<Equipment>> {
    return this.http.get<Response<Equipment>>(`${environment.url}api/zone/${zoneId}/equipment/${categoryId}/subType/${id}`);
  }

  getEquipments(zoneId: number, categoryId: number): Observable<Response<Equipment[]>> {
    return this.http.get<Response<Equipment[]>>(`${environment.url}api/zone/${zoneId}/equipment/${categoryId}/subType`);
  }

  createEquipment(data: CreateEquipmentDto): Observable<Response<Equipment>> {
    return this.http.post<Response<Equipment>>(`${environment.url}api/zone/${data.zoneId}/equipment/${data.equipmentId}/subType`, data);
  }

  updateEquipment(data: Equipment): Observable<Response<Equipment>> {
    return this.http.put<Response<Equipment>>(`${environment.url}api/zone/${data.zoneId}/equipment/${data.equipmentId}/subType/${data.id}`, data);
  }

  deleteEquipment(zoneId: number, categoryId: number, id: number): Observable<Response> {
    return this.http.delete<Response>(`${environment.url}api/zone/${zoneId}/equipment/${categoryId}/subType/${id}`);
  }

  duplicateEquipment(zoneId: number, id: number): Observable<Response<Equipment>> {
    return this.http.post<Response<Equipment>>(`${environment.url}api/equipment/form/duplicate`, {
      zoneId,
      subTypeId: id,
    });
  }

  getEquipmentFormData(equipmentId: number): Observable<Response<EquipmentFormData>> {
    return this.http.get<Response<EquipmentFormData>>(`${environment.url}api/formData/equipment/subType/${equipmentId}`);
  }

  createEquipmentFormData(data: CreateEquipmentFormData): Observable<Response<EquipmentFormData>> {
    return this.http.post<Response<EquipmentFormData>>(`${environment.url}api/formData/equipment/subType/${data.subTypeId}`, data);
  }

  updateEquipmentFormData(data: EquipmentFormData): Observable<Response<EquipmentFormData>> {
    return this.http.put<Response<EquipmentFormData>>(`${environment.url}api/formData/equipment/subType/${data.subTypeId}`, data);
  }

  // HVACs

  getConnectedZones(auditId: number, zoneId: number): Observable<Response<ZoneWithHvacConnected[]>> {
    return this.http.get<Response<ZoneWithHvacConnected[]>>(`${environment.url}api/audit/${auditId}/zone/${zoneId}/equipment/hvacConnectZone`);
  }

  setConnectedZones(auditId: number, zoneId: number, equipmentId: number, zoneIds: number[]): Observable<Response<HvacConnectedZone[]>> {
    return this.http.post<Response<HvacConnectedZone[]>>(`${environment.url}api/audit/${auditId}/zone/${zoneId}/equipment/hvacConnectZone`, {
      subTypeId: equipmentId,
      zoneIds,
    });
  }
}
