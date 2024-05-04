import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ToastService} from '@mean-stream/ngbx';
import {switchMap, tap} from 'rxjs';
import {AuditService} from 'src/app/shared/services/audit.service';
import {EquipmentService} from 'src/app/shared/services/equipment.service';
import {PercentageCompletion} from '../../shared/model/percentage-completion.interface';
import {SchemaSection} from '../../shared/model/schema.interface';
import {ZoneData} from '../../shared/model/zone.interface';
import {Equipment} from '../../shared/model/equipment.interface';


@Component({
  selector: 'app-type',
  templateUrl: './type.component.html',
  styleUrls: ['./type.component.scss']
})
export class TypeComponent implements OnInit {
  auditId?: number;
  equipmentId?: number;
  equipment?: Equipment;
  progress?: PercentageCompletion;
  typeSchema: SchemaSection[] = [];
  formData?: ZoneData;

  constructor(
    public equipmentService: EquipmentService,
    public auditService: AuditService,
    private route: ActivatedRoute,
    private toastService: ToastService,
  ) { }

  ngOnInit(): void {
    this.route.params.pipe(
      switchMap(({tid}) => this.equipmentService.getEquipment(+tid)),
      tap(equipment => this.equipment = equipment),
      switchMap(equipment => this.equipmentService.getEquipmentTypeSchema(equipment.type?.id ?? equipment.typeId)),
    ).subscribe(schema => {
      this.typeSchema = schema;
    });

    this.route.params.pipe(
      tap(({aid, tid}) => {
        this.auditId = +aid;
        this.equipmentId = +tid;
      }),
      switchMap(({tid}) => this.equipmentService.getEquipmentFormData(+tid)),
    ).subscribe(res => {
      this.formData = res ?? {data: {}};
    });

    this.route.params.pipe(
      switchMap(({tid}) => this.auditService.getPercentage({
        percentageType: 'form',
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
    formData.append('typeId', this.equipment?.type?.id + '');
    formData.append('subTypeId', tid);
    formData.append('photo', file, file.name);
    this.auditService.uploadPhoto(aid, formData).subscribe(() => {
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
        auditId: this.auditId,
        zoneId: this.route.snapshot.params.zid,
        equipmentId: this.equipment.type?.equipment.id,
        typeId: this.equipment.type?.id,
        subTypeId: this.equipment.id,
        data: this.formData.data,
      });
    request$.subscribe((res: any) => {
      this.formData = res;
      this.getPercentage();
      this.toastService.success('Form', 'Successfully saved form input');
    });
  }

  private getPercentage() {
    this.equipmentId && this.auditService.getPercentage({
      percentageType: 'form',
      subTypeId: this.equipmentId,
    }).subscribe(res => this.progress = res);
  }

  rename() {
    const equipment = this.equipment;
    if (!equipment) {
      return;
    }

    const kind = equipment?.type?.name;
    const name = prompt(`Rename ${kind}`, equipment.name);
    if (!name) {
      return;
    }

    this.equipmentService.updateEquipment({...equipment, name}).subscribe(res => {
      equipment && (equipment.name = res.name);
      this.toastService.success(`Rename ${kind}`, `Successfully renamed ${kind}`);
    });
  }
}
