import {Component, OnInit} from '@angular/core';
import {PercentageCompletion} from '../../shared/model/percentage-completion.interface';
import {SchemaSection} from '../../shared/model/schema.interface';
import {PreAuditData} from '../../shared/model/pre-audit-data.interface';
import {ActivatedRoute} from '@angular/router';
import {AuditService} from '../../shared/services/audit.service';
import {ToastService} from '@mean-stream/ngbx';
import {switchMap, tap} from 'rxjs';
import {SchemaService} from '../../shared/services/schema.service';

@Component({
  selector: 'app-grants',
  templateUrl: './grants.component.html',
  styleUrls: ['./grants.component.scss'],
})
export class GrantsComponent implements OnInit {
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

  ngOnInit() {
    this.schemaService.getSchema('grants').subscribe(({data}) => this.typeSchema = data);
    this.route.params.pipe(
      tap(({aid}) => this.auditId = +aid),
      switchMap(({aid}) => this.auditService.getGrantsData(aid)),
    ).subscribe(res => {
      this.formData = res.data ?? {data: {}};
    });

    this.getPercentage();
  }

  save() {
    if (!this.formData || !this.auditId) {
      return;
    }
    const request$ = this.formData.id
      ? this.auditService.updateGrantsData(this.auditId, this.formData)
      : this.auditService.createGrantsData(this.auditId, {
        auditId: this.auditId,
        data: this.formData.data,
      });
    request$.subscribe(res => {
      this.formData = res.data;
      this.toastService.success('Form', 'Successfully saved form input');
      this.getPercentage();
    });
  }

  getPercentage() {
    this.auditId && this.auditService.getPercentage({
      percentageType: 'grants',
      auditId: this.auditId,
    }).subscribe(res => this.progress = res);
  }
}
