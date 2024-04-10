import {Component, OnInit} from '@angular/core';
import {PercentageCompletion} from '../../shared/model/percentage-completion.interface';
import {SchemaSection} from '../../shared/model/schema.interface';
import {PreAuditData} from '../../shared/model/pre-audit-data.interface';
import {ActivatedRoute} from '@angular/router';
import {AuditService} from '../../shared/services/audit.service';
import {EquipmentService} from '../../shared/services/equipment.service';
import {ToastService} from '@mean-stream/ngbx';
import {switchMap, tap} from 'rxjs';

@Component({
  selector: 'app-grant',
  templateUrl: './grant.component.html',
  styleUrls: ['./grant.component.scss'],
})
export class GrantComponent implements OnInit {
  auditId?: number;
  progress?: PercentageCompletion;
  typeSchema: SchemaSection[] = [];
  formData?: PreAuditData;

  constructor(
    private route: ActivatedRoute,
    private auditService: AuditService,
    private equipmentService: EquipmentService,
    private toastService: ToastService,
  ) {
  }

  ngOnInit() {
    this.auditService.getGrantsJsonSchema().subscribe(schema => this.typeSchema = schema);
    this.route.params.pipe(
      tap(({aid}) => this.auditId = +aid),
      switchMap(({aid}) => this.auditService.getGrantsData(aid)),
    ).subscribe(res => {
      this.formData = res ?? {data: {}};
    });
    this.equipmentService.equipmentSubTypeData = null;

    /* TODO grants percentage
    this.route.params.pipe(
      switchMap(({aid}) => this.auditService.getPercentage(`?percentageType=grants&auditId=${aid}`)),
    ).subscribe(res => this.progress = res);
     */
  }

  save() {
    if (!this.formData || !this.auditId) {
      return;
    }
    if (this.formData.id) {
      this.auditService.updateGrantsData(this.auditId, this.formData).subscribe(() => {
        this.toastService.success('Form', 'Successfully saved form input');
      });
    } else {
      this.auditService.createGrantsData(this.auditId, {
        auditId: this.auditId,
        data: this.formData.data,
      }).subscribe(res => {
        this.formData = res;
        this.toastService.success('Form', 'Successfully saved form input');
      });
    }
  }
}
