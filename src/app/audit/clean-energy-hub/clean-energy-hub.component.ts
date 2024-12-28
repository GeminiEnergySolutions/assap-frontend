import {Component, OnInit} from '@angular/core';
import {PercentageCompletion} from '../../shared/model/percentage-completion.interface';
import {SchemaSection} from '../../shared/model/schema.interface';
import {PreAuditData} from '../../shared/model/pre-audit-data.interface';
import {ActivatedRoute} from '@angular/router';
import {AuditService} from '../../shared/services/audit.service';
import {ToastService} from '@mean-stream/ngbx';
import {switchMap, tap} from 'rxjs';
import {environment} from '../../../environments/environment';
import {AuthService} from '../../shared/services/auth.service';
import {SchemaService} from '../../shared/services/schema.service';

@Component({
  selector: 'app-clean-energy-hub',
  templateUrl: './clean-energy-hub.component.html',
  styleUrls: ['./clean-energy-hub.component.scss'],
  standalone: false,
})
export class CleanEnergyHubComponent implements OnInit {
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
    authService: AuthService,
  ) {
    this.authToken = authService.getAuthToken() ?? '';
  }

  ngOnInit() {
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
      percentageType: 'ceh',
      auditId: this.auditId,
    }).subscribe(res => this.progress = res);
  }
}
