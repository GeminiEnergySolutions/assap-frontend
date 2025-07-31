import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ToastService} from '@mean-stream/ngbx';
import {switchMap, tap} from 'rxjs';
import {ListPlaceholderComponent} from '../../shared/components/list-placeholder/list-placeholder.component';

import {ProgressBarComponent} from '../../shared/components/progress-bar/progress-bar.component';
import {FormComponent} from '../../shared/form/form/form.component';
import {SaveableChangesComponent} from '../../shared/guard/unsaved-changes.guard';
import {icons} from '../../shared/icons';
import {PercentageCompletion} from '../../shared/model/percentage-completion.interface';
import {PreAuditData} from '../../shared/model/pre-audit-data.interface';
import {SchemaSection} from '../../shared/model/schema.interface';
import {AuditService} from '../../shared/services/audit.service';
import {Breadcrumb, BreadcrumbService} from '../../shared/services/breadcrumb.service';
import {SchemaService} from '../../shared/services/schema.service';

@Component({
  selector: 'app-preaudit-form',
  templateUrl: './preaudit-form.component.html',
  styleUrl: './preaudit-form.component.scss',
  imports: [
    ProgressBarComponent,
    FormComponent,
    ListPlaceholderComponent,
  ],
})
export class PreauditFormComponent implements OnInit, SaveableChangesComponent, OnDestroy {
  @ViewChild('form') form?: FormComponent;

  auditId?: number;
  progress?: PercentageCompletion;
  typeSchema?: SchemaSection[];
  formData?: PreAuditData;

  constructor(
    private route: ActivatedRoute,
    private auditService: AuditService,
    private schemaService: SchemaService,
    private toastService: ToastService,
    private breadcrumbService: BreadcrumbService,
  ) {
  }

  isSaved(): boolean {
    return !this.form || this.form.isSaved();
  }

  ngOnInit() {
    const breadcrumb: Breadcrumb = {label: '', class: icons.audit, routerLink: '..', relativeTo: this.route};
    this.breadcrumbService.pushBreadcrumb(breadcrumb);
    this.breadcrumbService.pushBreadcrumb({
      label: 'Pre-Audit', class: icons.preAudit, routerLink: '.', relativeTo: this.route,
    });

    this.route.params.pipe(
      tap(({aid}) => this.auditId = +aid),
      switchMap(({aid}) => this.auditService.getSingleAudit(aid)),
    ).subscribe(({data}) => {
      this.formData = data.pre_audit_form;
      breadcrumb.label = data.auditName;
    });

    this.schemaService.getSchema('preAudit').subscribe(res => this.typeSchema = res.data);

    this.route.params.pipe(
      switchMap(({aid}) => this.auditService.getPercentage({
        progressType: 'preAudit',
        auditId: aid,
      })),
    ).subscribe(res => this.progress = res);
  }

  ngOnDestroy() {
    this.breadcrumbService.popBreadcrumb();
    this.breadcrumbService.popBreadcrumb();
  }

  save() {
    if (!this.formData || !this.auditId) {
      return;
    }
    const request$ = this.formData.id ?
      this.auditService.updatePreAuditData(this.auditId, this.formData) :
      this.auditService.createPreAuditData(this.auditId, {
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
    if (!this.auditId) {
      return;
    }
    this.auditService.getPercentage({
      progressType: 'complete',
      auditId: this.auditId,
    }).subscribe(res => this.auditService.currentProgress = res);
    this.auditService.getPercentage({
      progressType: 'preAudit',
      auditId: this.auditId,
    }).subscribe(res => this.progress = res);
  }
}
