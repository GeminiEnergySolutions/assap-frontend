import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ToastService} from '@mean-stream/ngbx';
import {Observable, switchMap} from 'rxjs';
import {AuditService} from '../services/audit.service';
import {EquipmentService} from '../services/equipment.service';
import {CopySpec, SchemaSection} from '../model/schema.interface';
import {ZoneDataResponse} from "../model/zone.interface";

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
})
export class FormComponent implements OnInit {
  @Input({required: true}) formType!: 'preAudit' | 'equipmentForm' | 'grants' | 'cleanenergyhub' | 'zone';

  dirty = false;
  typeSchema: SchemaSection[] = [];
  formData?: { id?: string | number; data: Record<string, string | number | boolean> };
  /** for offline storage */
  formId: string = '';

  constructor(
    private auditService: AuditService,
    public equipmentService: EquipmentService,
    private route: ActivatedRoute,
    private toastService: ToastService,
  ) {
    this.equipmentService.equipmentSubTypeData = null;
  }

  ngOnInit(): void {
    this.route.params
      .pipe(
        switchMap(({ tid }) => {
          if (tid) {
            return this.equipmentService.getSingleEquipmentSubType(tid);
          } else {
            return 'o';
          }
        })
      )
      .subscribe(async (subType: any) => {
        const auditId = this.route.snapshot.params.aid;
        switch (this.formType) {
          case "grants":
            this.formId = `audits/${auditId}/grants`;
            this.auditService.getGrantsJsonSchema().subscribe((schema: any) => {
              this.typeSchema = schema;
            });
            this.auditService.getGrantsData(auditId).subscribe((formData: any) => {
              if (formData) {
                this.formData = formData;
              } else {
                this.formData = { data: {} };
              }
            });
            this.equipmentService.equipmentSubTypeData = null;
            break;
          case "cleanenergyhub":
            this.formId = `audits/${auditId}/cleanenergyhub`;
            this.auditService.getCleanEnergyHubJsonSchema().subscribe((schema: any) => {
              this.typeSchema = schema;
            });
            this.auditService.getCleanEnergyHubData(auditId).subscribe((formData: any) => {
              if (formData) {
                this.formData = formData;
              } else {
                this.formData = { data: {} };
              }
            });
            this.equipmentService.equipmentSubTypeData = null;
            break;
          case "preAudit":
            this.formId = `audits/${auditId}/preaudit`;
            this.auditService.getPreAuditJsonSchema().subscribe((schema: any) => {
              this.typeSchema = schema.data;
            });
            this.auditService.getPreAuditData(auditId).subscribe((formData: any) => {
              if (formData.data) {
                this.formData = formData.data;
              } else {
                this.formData = { data: {} };
              }
            });
            this.equipmentService.equipmentSubTypeData = null;
            break;
          case "zone":
            const zoneId = this.route.snapshot.params.zid;
            this.formId = `audits/${auditId}/zones/${zoneId}`;
            this.auditService.getZoneJsonSchema().subscribe(schema => {
              this.typeSchema = schema.data;
            });
            this.auditService.getZoneData(zoneId).subscribe(response => {
              if (response.data.data) {
                this.formData = response.data;
              } else {
                this.formData = { data: {} };
              }
            });
            this.equipmentService.equipmentSubTypeData = null;
            break;
          case "equipmentForm":
            this.formId = `audits/${auditId}/subtypes/${subType.id}`; // TODO
            this.equipmentService.equipmentSubTypeData = subType;
            this.equipmentService.getEquipmentTypeFormSchema(subType.type ? subType.type.id : subType.typeChild.equipmentType.id).subscribe((schema: any) => {
              this.typeSchema = schema;
            });
            this.equipmentService.getEquipmentFormDataBySubType(subType.id).subscribe((formData: any) => {
              if (formData) {
                this.formData = formData;
              } else {
                this.formData = { data: {} };
              }
            });
            break;
        }
      });
  }

  getPercentage() {
    let queryParams = "";
    switch (this.formType) {
      case 'preAudit':
      case 'cleanenergyhub':
        queryParams = `?percentageType=complete&auditId=${this.route.snapshot.params.aid}`;
        break;
      case 'equipmentForm':
        queryParams = `?percentageType=form&subTypeId=${this.route.snapshot.params.tid}`;
        break;
      case 'zone':
        queryParams = `?percentageType=zone&zoneId=${this.route.snapshot.params.zid}`;
        break;
    }
    this.auditService.getPercentage(queryParams).subscribe((res: any) => {
      this.auditService.totalFields = res.totalFields ;
      this.auditService.completedFields = res.completedFields ;
      this.auditService.progressPercentage = res.percentage + '%';
    });
  }

  save() {
    if (!this.formData) {
      return;
    }

    // delete localStorage keys starting with this.formId
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(this.formId)) {
        localStorage.removeItem(key);
      }
    }

    switch (this.formType) {
      case 'preAudit':
        this.savePreAudit();
        break;
      case 'grants':
        this.saveGrants();
        break;
      case 'cleanenergyhub':
        this.saveCEH();
        break;
      case 'zone':
        this.saveZone();
        break;
      case 'equipmentForm':
        this.saveEquipment();
        break;
    }

    this.dirty = false;
  }

  private savePreAudit() {
    if (!this.formData) {
      return;
    }
    if (this.formData.id) {
      this.auditService.updatePreAuditData(this.route.snapshot.params.aid, this.formData as any).subscribe((res: any) => {
        this.toastService.success('Form', 'Successfully saved form input');
        this.getPercentage();
      });
    } else {
      let objData = {
        auditId: this.route.snapshot.params.aid,
        data: this.formData.data,
      };
      this.auditService.createPreAuditData(this.route.snapshot.params.aid, objData).subscribe((res: any) => {
        // this.formData = res.data;
        this.toastService.success('Form', 'Successfully saved form input');
        this.getPercentage();
      });
    }
  }

  private saveGrants() {
    if (!this.formData) {
      return;
    }
    if (this.formData.id) {
      this.auditService.updateGrantsData(this.route.snapshot.params.aid, this.formData).subscribe((res: any) => {
        this.toastService.success('Form', 'Successfully saved form input');
      });
    } else {
      let objData = {
        auditId: this.route.snapshot.params.aid,
        data: this.formData.data,
      };
      this.auditService.createGrantsData(this.route.snapshot.params.aid, objData).subscribe((res: any) => {
        this.formData = res;
        this.toastService.success('Form', 'Successfully saved form input');
      });
    }
  }

  private saveCEH() {
    if (!this.formData) {
      return;
    }
    if (this.formData.id) {
      this.auditService.updateCleanEnergyHubData(this.route.snapshot.params.aid, this.formData).subscribe((res: any) => {
        this.toastService.success('Form', 'Successfully saved form input');
        this.getPercentage();
      });
    } else {
      let objData = {
        auditId: this.route.snapshot.params.aid,
        data: this.formData.data,
      };
      this.auditService.createCleanEnergyHubData(this.route.snapshot.params.aid, objData).subscribe((res: any) => {
        this.formData = res;
        this.toastService.success('Form', 'Successfully saved form input');
        this.getPercentage();
      });
    }
  }

  private saveZone() {
    if (!this.formData) {
      return;
    }
    const auditId = this.route.snapshot.params.aid;
    const zoneId = this.route.snapshot.params.zid;
    let request$: Observable<ZoneDataResponse>;
    if (this.formData.id) {
      request$ = this.auditService.updateZoneData(zoneId, {
        auditId,
        zoneId,
        id: +this.formData.id,
        data: this.formData.data,
      });
    } else {
      request$ = this.auditService.createZoneData(zoneId, {
        auditId,
        zoneId,
        data: this.formData.data,
      });
    }
    request$.subscribe(() => {
      this.toastService.success('Zone Form', 'Successfully saved form input');
      this.getPercentage();
    });
  }

  private saveEquipment() {
    if (!this.formData) {
      return;
    }
    if (this.formData.id) {
      this.equipmentService.updateEquipmentFormData(this.formData).subscribe((res: any) => {
        this.getPercentage();
        this.toastService.success('Form', 'Successfully saved form input');
      });
    } else {
      let objData = {
        auditId: this.route.snapshot.params.aid,
        zoneId: this.route.snapshot.params.zid,
        equipmentId:
        this.equipmentService.equipmentSubTypeData.type.equipment.id,
        typeId: this.equipmentService.equipmentSubTypeData.type.id,
        subTypeId: this.equipmentService.equipmentSubTypeData.id,
        data: this.formData.data,
      };
      this.equipmentService.createEquipmentFormData(objData).subscribe((res: any) => {
        this.formData = res;
        this.getPercentage();
        this.toastService.success('Form', 'Successfully saved form input');
      });
    }
  }

  isMediumPage(schema: any, element: any) {
    if (this.formType != "preAudit" && this.formType != "cleanenergyhub") return false;

    let gridSize = 'col-12';
    if (schema.name == "Electric Vehicle") {
      gridSize = element.key.includes("ev_type_1_time") || element.key.includes("ev_type_2_time") || element.key.includes("ev_type_3_time") ? 'col-6' : gridSize;
    } else if (schema.name == "Non Electric Vehicle") {
      gridSize = element.key.includes("non_ev_type_1_time") || element.key.includes("non_ev_type_2_time") || element.key.includes("non_ev_type_3_time") ? 'col-6' : gridSize;
    } else if (schema.name == "Occupied Hours") {
      gridSize = element.key.includes("hour_time_") ? 'col-6' : gridSize;
    }
    return gridSize;
  }

  setDirty() {
    this.dirty = true;
  }

  canDeactivate(): boolean {
    return !this.dirty;
  }

  copyForm(copy: CopySpec) {
    if (!this.formData) {
      return;
    }

    const data = this.formData.data;
    let changed = 0;
    for (const [to, from] of Object.entries(copy.mappingInputs)) {
      if (data[to] === undefined || data[to] === null || data[to] === '') {
        data[to] = data[from];
        changed++;
      }
    }
    if (changed) {
      this.toastService.success(copy.buttonLabel, `Successfully copied ${changed} inputs`);
      this.setDirty();
    }
  }
}
