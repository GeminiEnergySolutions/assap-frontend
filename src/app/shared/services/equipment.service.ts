import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import {SchemaSection} from '../model/schema.interface';

@Injectable({
  providedIn: 'root'
})
export class EquipmentService {

  rootUrl = environment.url;

  equipmentSubTypeData: any;
  equipment: any = {};
  equipments: any = [];

  constructor(private http: HttpClient,
  ) { }

  getSingleEquipment(id: Number): Observable<any> {
    return this.http.get(`${this.rootUrl}api/equipment?equipmentId=${id}`);
  }
  getAllEquipments(): Observable<any> {
    return this.http.get(`${this.rootUrl}api/equipment`);
  }

  getSingleEquipmentType(id: Number): Observable<any> {
    return this.http.get(`${this.rootUrl}api/equipmentType?equipmentTypeId=${id}`);
  }
  getEquipmentTypesByEquipmentId(equipmentId: Number): Observable<any> {
    return this.http.get(`${this.rootUrl}api/equipmentTypesByEquipmentId?equipmentId=${equipmentId}`);
  }

  getEquipmentTypeChilds(typeId: number): Observable<any> {
    return this.http.get(`${this.rootUrl}api/equipmentTypeChild/${typeId}/`);
  }

  getSingleEquipmentSubType(subTypeId: number): Observable<any> {
    return this.http.get(`${this.rootUrl}api/equipmentSubType/${subTypeId}`);
  }
  getEquipmentSubTypes(auditId: number, zoneId: number, equipmentId: Number): Observable<any> {
    return this.http.get(`${this.rootUrl}api/equipmentSubType?zoneId=${zoneId}&equipmentId=${equipmentId}`);
  }
  createEquipmentSubType(equipmentSubTypeData: any): Observable<any> {
    return this.http.post(`${this.rootUrl}api/equipmentSubType`, equipmentSubTypeData);
  }
  updateEquipmentSubType(equipmentSubTypeData: any): Observable<any> {
    return this.http.put(`${this.rootUrl}api/equipmentSubType`, equipmentSubTypeData);
  }
  deleteEquipmentSubType(subTypeId: number): Observable<any> {
    return this.http.delete(`${this.rootUrl}api/equipmentSubType/${subTypeId}`);
  }

  getEquipmentTypeFormSchema(typeId: number): Observable<SchemaSection[]> {
    return this.http.get<SchemaSection[]>(`${this.rootUrl}api/schema/type/${typeId}/`);
  }
  getEquipmentFormDataBySubType(subTypeId: number): Observable<any> {
    return this.http.get(`${this.rootUrl}api/equipmentForm?subTypeId=${subTypeId}`);
  }
  createEquipmentFormData(equipmentFormData: any): Observable<any> {
    return this.http.post(`${this.rootUrl}api/equipmentForm`, equipmentFormData);
  }
  updateEquipmentFormData(equipmentFormData: any): Observable<any> {
    return this.http.put(`${this.rootUrl}api/equipmentForm`, equipmentFormData);
  }
}
