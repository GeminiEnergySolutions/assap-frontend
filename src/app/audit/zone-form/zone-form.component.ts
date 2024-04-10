import {Component, OnInit} from '@angular/core';
import {PercentageCompletion} from '../../shared/model/percentage-completion.interface';
import {SchemaSection} from '../../shared/model/schema.interface';
import {ActivatedRoute} from '@angular/router';
import {AuditService} from '../../shared/services/audit.service';
import {EquipmentService} from '../../shared/services/equipment.service';
import {ToastService} from '@mean-stream/ngbx';
import {Observable, switchMap, tap} from 'rxjs';
import {ZoneData, ZoneDataResponse} from '../../shared/model/zone.interface';

@Component({
  selector: 'app-zone-form',
  templateUrl: './zone-form.component.html',
  styleUrl: './zone-form.component.scss'
})
export class ZoneFormComponent implements OnInit {
  auditId?: number;
  zoneId?: number;
  progress?: PercentageCompletion;
  typeSchema: SchemaSection[] = [];
  formData?: ZoneData;

  constructor(
    private route: ActivatedRoute,
    private auditService: AuditService,
    private equipmentService: EquipmentService,
    private toastService: ToastService,
  ) {
  }

  ngOnInit() {
    this.auditService.getZoneJsonSchema().subscribe(schema => this.typeSchema = schema.data);

    this.route.params.pipe(
      tap(({aid, zid}) => {
        this.auditId = +aid;
        this.zoneId = +zid;
      }),
      switchMap(({zid}) => this.auditService.getZoneData(+zid)),
    ).subscribe(res => {
      this.formData = res.data ?? {data: {}};
      this.getPercentage();
    });
    this.equipmentService.equipmentSubTypeData = null;
  }

  save() {
    if (!this.formData || !this.auditId || !this.zoneId) {
      return;
    }
    let request$: Observable<ZoneDataResponse>;
    if (this.formData.id) {
      request$ = this.auditService.updateZoneData(this.zoneId, this.formData);
    } else {
      request$ = this.auditService.createZoneData(this.zoneId, {
        auditId: this.auditId,
        zoneId: this.zoneId,
        data: this.formData.data,
      });
    }
    request$.subscribe(res => {
      this.formData = res.data;
      this.toastService.success('Zone Form', 'Successfully saved form input');
      this.getPercentage();
    });
  }

  private getPercentage() {
    this.auditService.getPercentage(`?percentageType=zone&auditId=${this.auditId}`).subscribe(res => this.progress = res);
  }
}
