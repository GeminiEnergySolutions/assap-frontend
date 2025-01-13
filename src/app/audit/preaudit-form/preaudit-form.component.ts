import {Component, OnInit, ViewChild} from '@angular/core';
import {PercentageCompletion} from '../../shared/model/percentage-completion.interface';
import {ActivatedRoute} from '@angular/router';
import {PreAuditData} from '../../shared/model/pre-audit-data.interface';
import {AuditService} from '../../shared/services/audit.service';
import {SchemaSection} from '../../shared/model/schema.interface';
import {Observable, switchMap, tap} from 'rxjs';
import {ToastService} from '@mean-stream/ngbx';
import {SchemaService} from '../../shared/services/schema.service';
import {FormComponent} from '../../shared/form/form/form.component';
import {SaveableChangesComponent} from '../../shared/guard/unsaved-changes.guard';

@Component({
  selector: 'app-preaudit-form',
  templateUrl: './preaudit-form.component.html',
  styleUrl: './preaudit-form.component.scss',
  standalone: false,
})
export class PreauditFormComponent implements OnInit, SaveableChangesComponent {
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
  ) {
  }

  isSaved(): boolean {
    return !this.form || this.form.isSaved();
  }

  ngOnInit() {
    this.schemaService.getSchema('preAudit').subscribe(res => this.typeSchema = res.data);

    this.route.params.pipe(
      tap(({aid}) => this.auditId = +aid),
      switchMap(({aid}) => this.auditService.getPreAuditData(+aid)),
    ).subscribe(res => {
      this.formData = res.data ?? {data: {}};
    });

    this.route.params.pipe(
      switchMap(({aid}) => this.auditService.getPercentage({
        progressType: 'preAudit',
        auditId: aid,
      })),
    ).subscribe(res => this.progress = res);
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
