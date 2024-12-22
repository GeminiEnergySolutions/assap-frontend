import {Component, OnInit} from '@angular/core';
import {PercentageCompletion} from '../../shared/model/percentage-completion.interface';
import {SchemaSection} from '../../shared/model/schema.interface';
import {ActivatedRoute} from '@angular/router';
import {AuditService} from '../../shared/services/audit.service';
import {ToastService} from '@mean-stream/ngbx';
import {Observable, switchMap, tap} from 'rxjs';
import {ZoneData} from '../../shared/model/zone.interface';
import {SchemaService} from '../../shared/services/schema.service';
import {Response} from '../../shared/model/response.interface';

@Component({
  selector: 'app-zone-form',
  templateUrl: './zone-form.component.html',
  styleUrl: './zone-form.component.scss'
})
export class ZoneFormComponent implements OnInit {
  auditId?: number;
  zoneId?: number;
  progress?: PercentageCompletion;
  typeSchema?: SchemaSection[];
  formData?: ZoneData;

  constructor(
    private route: ActivatedRoute,
    private auditService: AuditService,
    private schemaService: SchemaService,
    private toastService: ToastService,
  ) {
  }

  ngOnInit() {
    this.schemaService.getSchema('zone').subscribe(schema => this.typeSchema = schema.data);

    this.route.params.pipe(
      tap(({aid, zid}) => {
        this.auditId = +aid;
        this.zoneId = +zid;
      }),
      switchMap(({zid}) => this.auditService.getZoneData(+zid)),
    ).subscribe(res => {
      this.formData = res.data.data ? res.data : {
        id: 0, // NB: if branch below that checks for this.formData.id will consider this as falsy
        zoneId: this.zoneId!,
        auditId: this.auditId!,
        data: {},
      };
      this.getPercentage();
    });
  }

  save() {
    if (!this.formData || !this.auditId || !this.zoneId) {
      return;
    }
    let request$: Observable<Response<ZoneData>>;
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
    this.zoneId && this.auditService.getPercentage({
      percentageType: 'zoneDetails',
      auditId: this.route.snapshot.params.aid,
      zoneId: this.zoneId,
    }).subscribe(res => this.progress = res);
  }
}
