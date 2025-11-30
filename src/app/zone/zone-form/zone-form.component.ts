import {Component, inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ToastService} from '@mean-stream/ngbx';
import {Observable, switchMap, tap} from 'rxjs';

import {ListPlaceholderComponent} from '../../shared/components/list-placeholder/list-placeholder.component';
import {ProgressBarComponent} from '../../shared/components/progress-bar/progress-bar.component';
import {FormComponent} from '../../shared/form/form/form.component';
import {SaveableChangesComponent} from '../../shared/guard/unsaved-changes.guard';
import {icons} from '../../shared/icons';
import {PercentageCompletion} from '../../shared/model/percentage-completion.interface';
import {Response} from '../../shared/model/response.interface';
import {SchemaSection} from '../../shared/model/schema.interface';
import {ZoneData} from '../../shared/model/zone.interface';
import {AuditZoneService} from '../../shared/services/audit-zone.service';
import {AuditService} from '../../shared/services/audit.service';
import {Breadcrumb, BreadcrumbService} from '../../shared/services/breadcrumb.service';
import {SchemaService} from '../../shared/services/schema.service';

@Component({
  selector: 'app-zone-form',
  templateUrl: './zone-form.component.html',
  styleUrl: './zone-form.component.scss',
  imports: [
    ProgressBarComponent,
    FormComponent,
    ListPlaceholderComponent,
  ],
})
export class ZoneFormComponent implements OnInit, SaveableChangesComponent, OnDestroy {
  private route = inject(ActivatedRoute);
  private auditService = inject(AuditService);
  private zoneService = inject(AuditZoneService);
  private schemaService = inject(SchemaService);
  private toastService = inject(ToastService);
  private breadcrumbService = inject(BreadcrumbService);

  @ViewChild('form') form?: FormComponent;

  auditId?: number;
  zoneId?: number;
  progress?: PercentageCompletion;
  typeSchema?: SchemaSection[];
  formData?: ZoneData;

  isSaved(): boolean {
    return !this.form || this.form.isSaved();
  }

  ngOnInit() {
    const breadcrumb: Breadcrumb = {label: '', class: icons.zone, routerLink: '..', relativeTo: this.route};
    this.breadcrumbService.pushBreadcrumb(breadcrumb);
    this.breadcrumbService.pushBreadcrumb({
      label: 'Zone Details', class: icons.zoneDetails, routerLink: '.', relativeTo: this.route,
    });

    this.route.params.pipe(
      switchMap(({aid, zid}) => this.zoneService.getSingleZone(aid, zid)),
    ).subscribe(({data}) => {
      breadcrumb.label = data.zoneName;
    });

    this.schemaService.getSchema('zone').subscribe(schema => this.typeSchema = schema.data);

    this.route.params.pipe(
      tap(({aid, zid}) => {
        this.auditId = +aid;
        this.zoneId = +zid;
      }),
      switchMap(({zid}) => this.zoneService.getZoneData(+zid)),
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

  ngOnDestroy() {
    this.breadcrumbService.popBreadcrumb();
    this.breadcrumbService.popBreadcrumb();
  }

  save() {
    if (!this.formData || !this.auditId || !this.zoneId) {
      return;
    }
    let request$: Observable<Response<ZoneData>>;
    if (this.formData.id) {
      request$ = this.zoneService.updateZoneData(this.zoneId, this.formData);
    } else {
      request$ = this.zoneService.createZoneData(this.zoneId, {
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
    if (!this.zoneId) {
      return;
    }
    this.auditService.getPercentage({
      progressType: 'zoneDetails',
      auditId: this.route.snapshot.params.aid,
      zoneId: this.zoneId,
    }).subscribe(res => this.progress = res);
  }
}
