import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ToastService} from '@mean-stream/ngbx';
import {switchMap} from 'rxjs';
import {AuditService} from '../../shared/services/audit.service';
import {Audit} from '../../shared/model/audit.interface';

@Component({
  selector: 'app-audit-detail',
  templateUrl: './audit-detail.component.html',
  styleUrls: ['./audit-detail.component.scss'],
})
export class AuditDetailComponent implements OnInit {
  audit?: Audit;

  constructor(
    public auditService: AuditService,
    private toastService: ToastService,
    public route: ActivatedRoute,
  ) {
  }

  ngOnInit(): void {
    this.route.params.pipe(
      switchMap(({aid}) => this.auditService.getSingleAudit(aid)),
    ).subscribe((res: any) => {
      this.audit = res.data;
    });

    this.route.params.pipe(
      switchMap(({aid}) => this.auditService.getPercentage({
        percentageType: 'complete',
        auditId: aid,
      })),
    ).subscribe(res => this.auditService.currentProgress = res);
  }

  rename() {
    const name = prompt('Rename Audit', this.audit!.auditName);
    if (!name) {
      return;
    }
    this.auditService.updateAudit({...this.audit, auditName: name}).subscribe(() => {
      this.audit!.auditName = name;
      this.toastService.success('Rename Audit', 'Successfully renamed audit.');
    });
  }
}
