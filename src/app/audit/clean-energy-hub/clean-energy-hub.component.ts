import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ToastService} from '@mean-stream/ngbx';
import {switchMap, tap} from 'rxjs';

import {environment} from '../../../environments/environment';
import {FormComponent} from '../../shared/form/form/form.component';
import {SaveableChangesComponent} from '../../shared/guard/unsaved-changes.guard';
import {icons} from '../../shared/icons';
import {PercentageCompletion} from '../../shared/model/percentage-completion.interface';
import {PreAuditData} from '../../shared/model/pre-audit-data.interface';
import {SchemaSection} from '../../shared/model/schema.interface';
import {AuditService} from '../../shared/services/audit.service';
import {AuthService} from '../../shared/services/auth.service';
import {Breadcrumb, BreadcrumbService} from '../../shared/services/breadcrumb.service';
import {SchemaService} from '../../shared/services/schema.service';

@Component({
  selector: 'app-clean-energy-hub',
  templateUrl: './clean-energy-hub.component.html',
  styleUrls: ['./clean-energy-hub.component.scss'],
  standalone: false,
})
export class CleanEnergyHubComponent implements OnInit, SaveableChangesComponent, OnDestroy {
  @ViewChild('form') form?: FormComponent;

  auditId?: number;
  progress?: PercentageCompletion;
  typeSchema?: SchemaSection[];
  formData?: PreAuditData;

  serverUrl = environment.url;
  authToken: string;

  constructor(
    private route: ActivatedRoute,
    private auditService: AuditService,
    private schemaService: SchemaService,
    private toastService: ToastService,
    private breadcrumbService: BreadcrumbService,
    authService: AuthService,
  ) {
    this.authToken = authService.getAuthToken() ?? '';
  }

  isSaved(): boolean {
    return !this.form || !this.form.dirty;
  }

  ngOnInit() {
    const breadcrumb: Breadcrumb = {label: '', class: icons.audit, routerLink: '..', relativeTo: this.route};
    this.breadcrumbService.pushBreadcrumb(breadcrumb);
    this.breadcrumbService.pushBreadcrumb({
      label: 'Clean Energy Hub', class: icons.ceh, routerLink: '.', relativeTo: this.route,
    });

    this.route.params.pipe(
      switchMap(({aid}) => this.auditService.getSingleAudit(aid)),
    ).subscribe(({data}) => {
      breadcrumb.label = data.auditName;
    });

    this.schemaService.getSchema('ceh').subscribe(({data}) => {
      this.typeSchema = data;
    });
    this.route.params.pipe(
      tap(({aid}) => this.auditId = +aid),
      switchMap(({aid}) => this.auditService.getCleanEnergyHubData(+aid)),
    ).subscribe(formData => {
      this.formData = formData.data ?? {data: {}};
    });
    this.getPercentage();
  }

  ngOnDestroy() {
    this.breadcrumbService.popBreadcrumb();
    this.breadcrumbService.popBreadcrumb();
  }

  save() {
    if (!this.formData || !this.auditId) {
      return;
    }
    const request$ = this.formData.id
      ? this.auditService.updateCleanEnergyHubData(this.auditId, this.formData)
      : this.auditService.createCleanEnergyHubData(this.auditId, {
        auditId: this.auditId,
        data: this.formData.data,
      });
    request$.subscribe(res => {
      this.formData = res.data;
      this.toastService.success('Form', 'Successfully saved form input');
      this.getPercentage();
    });
  }

  private getPercentage() {
    this.auditId && this.auditService.getPercentage({
      progressType: 'ceh',
      auditId: this.auditId,
    }).subscribe(res => this.progress = res);
  }
}
