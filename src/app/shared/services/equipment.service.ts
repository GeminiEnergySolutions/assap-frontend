import {HttpClient} from '@angular/common/http';
import {inject, Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {
  CreateEquipmentDto,
  CreateEquipmentFormData,
  CreateEquipmentTypeDto,
  Equipment,
  EquipmentCategory,
  EquipmentFormData,
  EquipmentType,
  UpdateEquipmentTypeDto,
} from '../model/equipment.interface';
import {Response} from '../model/response.interface';
import {HvacConnectedZone, ZoneWithHvacConnected} from '../model/zone.interface';

@Injectable({providedIn: 'root'})
export class EquipmentService {
  private http = inject(HttpClient);

  getEquipmentCategory(id: number): Observable<Response<EquipmentCategory>> {
    return this.http.get<Response<EquipmentCategory>>(`/api/equipment/${id}`);
  }

  getEquipmentCategories(): Observable<Response<EquipmentCategory[]>> {
    return this.http.get<Response<EquipmentCategory[]>>(`/api/equipment`);
  }

  getEquipmentType(categoryId: number, id: number): Observable<Response<EquipmentType>> {
    return this.http.get<Response<EquipmentType>>(`/api/equipment/${categoryId}/type/${id}`);
  }

  getEquipmentTypes(categoryId: number): Observable<Response<EquipmentType[]>> {
    return this.http.get<Response<EquipmentType[]>>(`/api/equipment/${categoryId}/type`);
  }

  createEquipmentType(categoryId: number, data: CreateEquipmentTypeDto): Observable<Response<EquipmentType>> {
    return this.http.post<Response<EquipmentType>>(`/api/equipment/${categoryId}/type`, data);
  }

  updateEquipmentType(categoryId: number, data: UpdateEquipmentTypeDto): Observable<Response<EquipmentType>> {
    return this.http.put<Response<EquipmentType>>(`/api/equipment/${categoryId}/type/${data.id}`, data);
  }

  deleteEquipmentType(categoryId: number, id: number): Observable<Response> {
    return this.http.delete<Response>(`/api/equipment/${categoryId}/type/${id}`);
  }

  getEquipment(zoneId: number, categoryId: number, id: number): Observable<Response<Equipment>> {
    return this.http.get<Response<Equipment>>(`/api/zone/${zoneId}/equipment/${categoryId}/subType/${id}`);
  }

  getEquipments(zoneId: number, categoryId: number): Observable<Response<Equipment[]>> {
    return this.http.get<Response<Equipment[]>>(`/api/zone/${zoneId}/equipment/${categoryId}/subType`);
  }

  createEquipment(data: CreateEquipmentDto): Observable<Response<Equipment>> {
    return this.http.post<Response<Equipment>>(`/api/zone/${data.zoneId}/equipment/${data.equipmentId}/subType`, data);
  }

  updateEquipment(data: Equipment): Observable<Response<Equipment>> {
    return this.http.put<Response<Equipment>>(`/api/zone/${data.zoneId}/equipment/${data.equipmentId}/subType/${data.id}`, data);
  }

  deleteEquipment(zoneId: number, categoryId: number, id: number): Observable<Response> {
    return this.http.delete<Response>(`/api/zone/${zoneId}/equipment/${categoryId}/subType/${id}`);
  }

  duplicateEquipment(id: number, zoneId: number, name?: string): Observable<Response<Equipment>> {
    return this.http.post<Response<Equipment>>(`/api/formData/equipment/subType/${id}/duplicate`, {
      zoneId,
      subTypeId: id,
      name,
    });
  }

  getEquipmentFormData(equipmentId: number): Observable<Response<EquipmentFormData>> {
    return this.http.get<Response<EquipmentFormData>>(`/api/formData/equipment/subType/${equipmentId}`);
  }

  createEquipmentFormData(data: CreateEquipmentFormData): Observable<Response<EquipmentFormData>> {
    return this.http.post<Response<EquipmentFormData>>(`/api/formData/equipment/subType/${data.subTypeId}`, data);
  }

  updateEquipmentFormData(data: EquipmentFormData): Observable<Response<EquipmentFormData>> {
    return this.http.put<Response<EquipmentFormData>>(`/api/formData/equipment/subType/${data.subTypeId}`, data);
  }

  // HVACs

  getConnectedZones(auditId: number, zoneId: number): Observable<Response<ZoneWithHvacConnected[]>> {
    return this.http.get<Response<ZoneWithHvacConnected[]>>(`/api/audit/${auditId}/zone/${zoneId}/equipment/hvacConnectZone`);
  }

  setConnectedZones(auditId: number, zoneId: number, equipmentId: number, zoneIds: number[]): Observable<Response<HvacConnectedZone[]>> {
    return this.http.post<Response<HvacConnectedZone[]>>(`/api/audit/${auditId}/zone/${zoneId}/equipment/hvacConnectZone`, {
      subTypeId: equipmentId,
      zoneIds,
    });
  }
}
