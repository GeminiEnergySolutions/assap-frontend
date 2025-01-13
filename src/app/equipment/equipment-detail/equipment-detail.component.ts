import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ToastService} from '@mean-stream/ngbx';
import {map, switchMap, tap} from 'rxjs';

import {FormComponent} from '../../shared/form/form/form.component';
import {SaveableChangesComponent} from '../../shared/guard/unsaved-changes.guard';
import {Equipment, EquipmentFormData} from '../../shared/model/equipment.interface';
import {PercentageCompletion} from '../../shared/model/percentage-completion.interface';
import {SchemaSection} from '../../shared/model/schema.interface';
import {AuditService} from '../../shared/services/audit.service';
import {EquipmentService} from '../../shared/services/equipment.service';
import {PhotoService} from '../../shared/services/photo.service';
import {SchemaService} from '../../shared/services/schema.service';

@Component({
  selector: 'app-equipment-detail',
  templateUrl: './equipment-detail.component.html',
  styleUrls: ['./equipment-detail.component.scss'],
  standalone: false,
})
export class EquipmentDetailComponent implements OnInit, SaveableChangesComponent {
  @ViewChild('form') form?: FormComponent;

  auditId?: number;
  equipmentId?: number;
  equipment?: Equipment;
  progress?: PercentageCompletion;
  typeSchema?: SchemaSection[];
  formData?: EquipmentFormData;

  constructor(
    public equipmentService: EquipmentService,
    public auditService: AuditService,
    private photoService: PhotoService,
    private schemaService: SchemaService,
    private route: ActivatedRoute,
    private toastService: ToastService,
  ) { }

  isSaved(): boolean {
    return !this.form || this.form.isSaved();
  }

  ngOnInit(): void {
    this.route.params.pipe(
      switchMap(({zid, eid, tid}) => this.equipmentService.getEquipment(+zid, +eid, +tid)),
      map(({data}) => this.equipment = data),
      switchMap(equipment => this.schemaService.getSchema(`equipment/${equipment.type?.id ?? equipment.typeId}`)),
    ).subscribe(({data}) => {
      this.typeSchema = data;
    });

    this.route.params.pipe(
      tap(({aid, tid}) => {
        this.auditId = +aid;
        this.equipmentId = +tid;
      }),
      switchMap(({tid}) => this.equipmentService.getEquipmentFormData(+tid)),
    ).subscribe(res => {
      this.formData = res.data ?? {data: {}};
    });

    this.route.params.pipe(
      switchMap(({zid, tid}) => this.auditService.getPercentage({
        progressType: 'equipmentForm',
        auditId: this.auditId!,
        zoneId: zid,
        subTypeId: tid,
      })),
    ).subscribe(res => this.progress = res);
  }

  uploadPhoto(file: File) {
    if (!this.equipment) {
      return;
    }

    this.photoService.uploadPhoto({
      auditId: this.equipment.auditId,
      zoneId: this.equipment.zoneId,
      equipmentId: this.equipment.equipmentId,
      typeId: this.equipment.typeId,
      subTypeId: this.equipment.id,
    }, file).subscribe(() => {
      this.toastService.success('Upload Equipment Photo', `Sucessfully uploaded photo for ${this.equipment?.type?.name} '${this.equipment?.name}'.`);
    });
  }

  save() {
    if (!this.formData || !this.auditId || !this.equipmentId || !this.equipment) {
      return;
    }
    const request$ = this.formData.id
      ? this.equipmentService.updateEquipmentFormData(this.formData)
      : this.equipmentService.createEquipmentFormData({
        auditId: this.equipment.auditId,
        zoneId: this.equipment.zoneId,
        equipmentId: this.equipment.equipmentId,
        typeId: this.equipment.typeId,
        subTypeId: this.equipment.id,
        data: this.formData.data,
      });
    request$.subscribe(res => {
      this.formData = res.data;
      this.getPercentage();
      this.toastService.success('Form', 'Successfully saved form input');
    });
  }

  private getPercentage() {
    this.equipmentId && this.auditService.getPercentage({
      progressType: 'equipmentForm',
      auditId: this.auditId!,
      zoneId: this.route.snapshot.params.zid,
      subTypeId: this.equipmentId,
    }).subscribe(res => this.progress = res);
  }
}
