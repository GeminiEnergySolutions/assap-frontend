import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ToastService} from '@mean-stream/ngbx';
import {map, switchMap, tap} from 'rxjs';
import {AuditService} from 'src/app/shared/services/audit.service';
import {EquipmentService} from 'src/app/shared/services/equipment.service';
import {PercentageCompletion} from '../../shared/model/percentage-completion.interface';
import {SchemaSection} from '../../shared/model/schema.interface';
import {Equipment, EquipmentFormData} from '../../shared/model/equipment.interface';
import {SchemaService} from '../../shared/services/schema.service';
import {PhotoService} from '../../shared/services/photo.service';


@Component({
  selector: 'app-equipment-detail',
  templateUrl: './equipment-detail.component.html',
  styleUrls: ['./equipment-detail.component.scss'],
  standalone: false,
})
export class EquipmentDetailComponent implements OnInit {
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
        percentageType: 'equipmentForm',
        auditId: this.auditId!,
        zoneId: zid,
        subTypeId: tid,
      })),
    ).subscribe(res => this.progress = res);
  }

  uploadPhoto(file: File) {
    const {aid, tid, zid} = this.route.snapshot.params;
    const formData = new FormData();
    formData.append('auditId', aid);
    formData.append('zoneId', zid);
    formData.append('equipmentId', this.equipment?.equipmentId + '');
    formData.append('typeId', this.equipment?.typeId + '');
    formData.append('subTypeId', tid);
    formData.append('photo', file, file.name);
    this.photoService.uploadPhoto(formData).subscribe(() => {
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
      percentageType: 'equipmentForm',
      auditId: this.auditId!,
      zoneId: this.route.snapshot.params.zid,
      subTypeId: this.equipmentId,
    }).subscribe(res => this.progress = res);
  }

  rename() {
    const equipment = this.equipment;
    if (!equipment) {
      return;
    }

    const kind = equipment.type?.name;
    const name = prompt(`Rename ${kind}`, equipment.name);
    if (!name) {
      return;
    }

    this.equipmentService.updateEquipment({...equipment, name}).subscribe(({data}) => {
      equipment.name = data.name;
      this.toastService.success(`Rename ${kind}`, `Successfully renamed ${kind}`);
    });
  }
}
