import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ToastService} from '@mean-stream/ngbx';
import {Observable, switchMap} from 'rxjs';
import {AuditService} from '../services/audit.service';
import {EquipmentService} from '../services/equipment.service';
import {CopySpec, SchemaSection} from '../model/schema.interface';
import {ZoneDataResponse} from "../model/zone.interface";
import {Equipment} from '../model/equipment.interface';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
})
export class FormComponent implements OnInit {
  @Input({required: true}) formType!: 'preAudit' | 'equipmentForm' | 'grants' | 'cleanenergyhub' | 'zone';
  @Input() typeSchema: SchemaSection[] = [];
  @Input() formData?: { id?: string | number; data: Record<string, string | number | boolean> };
  /** for offline storage */
  @Input() formId: string = '';
  @Output() saved = new EventEmitter<void>();

  dirty = false;

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
            return this.equipmentService.getEquipment(tid);
          } else {
            return 'o';
          }
        })
      )
      .subscribe(async (subType: Equipment | string) => {
        const auditId = this.route.snapshot.params.aid;
        switch (this.formType) {
          case "grants":
            // Handled by GrantComponent
            break;
          case "cleanenergyhub":
            // handled by CleanEnergyHubComponent
            break;
          case "preAudit":
            // handled by PreauditFormComponent
            break;
          case "zone":
            // handled by ZoneFormComponent
            break;
          case "equipmentForm":
            if (typeof subType === 'string') {
              return;
            }
            this.formId = `audits/${auditId}/subtypes/${subType.id}`;
            this.equipmentService.equipmentSubTypeData = subType;
            this.equipmentService.getEquipmentTypeSchema(subType.typeChild?.equipmentType.id ?? subType.type?.id ?? subType.typeId).subscribe((schema: any) => {
              this.typeSchema = schema;
            });
            this.equipmentService.getEquipmentFormData(subType.id).subscribe((formData: any) => {
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
        // handled by PreauditFormComponent
        return;
      case 'cleanenergyhub':
        // handled by CleanEnergyHubComponent
        break;
      case 'equipmentForm':
        queryParams = `?percentageType=form&subTypeId=${this.route.snapshot.params.tid}`;
        break;
      case 'zone':
        // handled by ZoneFormComponent
        break;
    }
    this.auditService.getPercentage(queryParams).subscribe(res => this.auditService.currentProgress = res);
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
      case "preAudit":
        // handled by PreauditFormComponent
        break;
      case 'grants':
        // handled by GrantComponent
        break;
      case 'cleanenergyhub':
        // handled by CleanEnergyHubComponent
        break;
      case 'zone':
        // handled by ZoneFormComponent
        break;
      case 'equipmentForm':
        this.saveEquipment();
        break;
    }
    this.saved.emit();

    this.dirty = false;
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
