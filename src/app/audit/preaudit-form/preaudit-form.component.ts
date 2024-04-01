import {Component, OnInit} from '@angular/core';
import {PercentageCompletion} from '../../shared/model/percentage-completion.interface';
import {ActivatedRoute} from '@angular/router';
import {PreAuditData} from '../../shared/model/pre-audit-data.interface';
import {AuditService} from '../../shared/services/audit.service';
import {SchemaSection} from '../../shared/model/schema.interface';
import {switchMap, tap} from 'rxjs';
import {EquipmentService} from '../../shared/services/equipment.service';
import {ToastService} from '@mean-stream/ngbx';

@Component({
  selector: 'app-preaudit-form',
  templateUrl: './preaudit-form.component.html',
  styleUrl: './preaudit-form.component.scss',
})
export class PreauditFormComponent implements OnInit {
  auditId?: string;
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
    this.auditService.getPreAuditJsonSchema().subscribe(res => this.typeSchema = res.data);

    this.route.params.pipe(
      tap(({aid}) => this.auditId = aid),
      switchMap(({aid}) => this.auditService.getPreAuditData(aid)),
    ).subscribe(res => {
      this.formData = res.data ?? {data: {}};
    });
    this.equipmentService.equipmentSubTypeData = null;

    this.route.params.pipe(
      switchMap(({aid}) => this.auditService.getPercentage(`?percentageType=preaudit&auditId=${aid}`)),
    ).subscribe(res => this.progress = res);
  }

  save() {
    if (!this.formData) {
      return;
    }
    if (this.formData.id) {
      this.auditService.updatePreAuditData(this.route.snapshot.params.aid, this.formData).subscribe(res => {
        this.toastService.success('Form', 'Successfully saved form input');
        this.getPercentage(res.data.auditId);
      });
    } else {
      let objData = {
        auditId: this.route.snapshot.params.aid,
        data: this.formData!.data,
      };
      this.auditService.createPreAuditData(this.route.snapshot.params.aid, objData).subscribe(res => {
        // this.formData = res.data;
        this.toastService.success('Form', 'Successfully saved form input');
        this.getPercentage(res.data.auditId);
      });
    }
  }

  private getPercentage(aid: number) {
    this.auditService.getPercentage(`?percentageType=complete&auditId=${aid}`).subscribe(res => this.auditService.currentProgress = res);
    this.auditService.getPercentage(`?percentageType=preaudit&auditId=${aid}`).subscribe(res => this.progress = res);
  }
}
