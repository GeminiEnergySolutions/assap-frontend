import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ToastService} from 'ng-bootstrap-ext';
import {switchMap} from 'rxjs';
import {AuditService} from '../services/audit.service';
import {EquipmentService} from '../services/equipment.service';
import {SchemaSection} from '../model/schema.interface';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
})
export class FormComponent implements OnInit {
  dirty = false;
  typeSchema: SchemaSection[] = [];
  formData?: any = { data: {} };
  formType: string = '';

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
        if (subType === 'o') {
          let url;
          this.route.url.subscribe((res: any) => {
            url = res[0].path;
          });
          if (url === 'grants') {
            this.formType = 'grants';
            this.auditService.getGrantsJsonSchema().subscribe((schema: any) => {
              this.typeSchema = schema;
            });
            this.auditService.getGrantsData(this.route.snapshot.params.aid).subscribe((formData: any) => {
              if (formData) {
                this.formData = formData;
              } else {
                this.formData = { data: {} };
              }
            });
          } else if (url === 'cleanenergyhub') {
            this.formType = 'cleanenergyhub';
            this.auditService.getCleanEnergyHubJsonSchema().subscribe((schema: any) => {
              this.typeSchema = schema;
            });
            this.auditService.getCleanEnergyHubData(this.route.snapshot.params.aid).subscribe((formData: any) => {
              if (formData) {
                this.formData = formData;
              } else {
                this.formData = { data: {} };
              }
            });
          }
          else {
            this.formType = 'preAudit';
            this.auditService.getPreAuditJsonSchema().subscribe((schema: any) => {
              this.typeSchema = schema.data;
            });
            this.auditService.getPreAuditData(this.route.snapshot.params.aid).subscribe((formData: any) => {
              if (formData.data) {
                this.formData = formData.data;
              } else {
                this.formData = { data: {} };
              }
            });
          }
          this.equipmentService.equipmentSubTypeData = null;
        } else {
          this.formType = 'equipmentForm';
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
        }
      });
  }

  getPercentage() {
    let queryParams = "";
    if (this.formType === 'preAudit') {
      queryParams = `?percentageType=complete&auditId=${this.route.snapshot.params.aid}`;
    } else if (this.formType === 'equipmentForm') {
      queryParams = `?percentageType=form&subTypeId=${this.route.snapshot.params.tid}`;
    }
    this.auditService.getPercentage(queryParams).subscribe((res: any) => {
      this.auditService.totalFields = res.totalFields ;
      this.auditService.completedFields = res.completedFields ;
      this.auditService.progressPercentage = res.percentage + '%';
    });
  }

  save() {
    if (this.formType === 'preAudit') {
      if (this.formData.id) {
        this.auditService.updatePreAuditData(this.route.snapshot.params.aid, this.formData).subscribe((res: any) => {
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
      // this.toastService.success('Form', 'Successfully saved form input');
    } else if (this.formType === 'grants') {
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
    } else if (this.formType === 'cleanenergyhub') {
      if (this.formData.id) {
        this.auditService.updateCleanEnergyHubData(this.route.snapshot.params.aid, this.formData).subscribe((res: any) => {
          this.toastService.success('Form', 'Successfully saved form input');
        });
      } else {
        let objData = {
          auditId: this.route.snapshot.params.aid,
          data: this.formData.data,
        };
        this.auditService.createCleanEnergyHubData(this.route.snapshot.params.aid, objData).subscribe((res: any) => {
          this.formData = res;
          this.toastService.success('Form', 'Successfully saved form input');
        });
      }
      const queryParams = `?percentageType=complete&auditId=${this.route.snapshot.params.aid}`;
      this.auditService.getPercentage(queryParams).subscribe((res: any) => {
        this.auditService.totalFields = res.totalFields ;
        this.auditService.completedFields = res.completedFields ;
        this.auditService.progressPercentage = res.percentage + '%';
      });
    } else {
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

    this.dirty = false;
  }

  shareHvacData() {
    if (confirm("Are you sure! all hvac of current Audit will be replaced with current hvac data")) {
      let objData = {
        auditId: Number(this.route.snapshot.params.aid),
        zoneId: Number(this.route.snapshot.params.zid),
        subTypeId: Number(this.equipmentService.equipmentSubTypeData.id)
      };
      this.equipmentService.auditZoneHVAC(objData).subscribe((res: any) => {
        this.toastService.success('Success', res.message);
      });
    }
  }

  shareCEHVehicleScedule(schema: any) {
    if (confirm(`Are you sure! want to share ${schema.name} schedule?`)) {
      let objData = {
        auditId: Number(this.route.snapshot.params.aid),
        shareFrom: schema.name == 'Electric Vehicle' ? 'ev' : 'non_ev'
      };
      this.equipmentService.CEHVehicleSchedule(objData).subscribe((res: any) => {
        this.formData = res.data;
        this.toastService.success('Success', res.message);
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
}
