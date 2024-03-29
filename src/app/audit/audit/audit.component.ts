import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ToastService} from '@mean-stream/ngbx';
import {switchMap} from 'rxjs';
import {AuditService} from '../../shared/services/audit.service';

@Component({
  selector: 'app-audit',
  templateUrl: './audit.component.html',
  styleUrls: ['./audit.component.scss'],
})
export class AuditComponent implements OnInit {
  audit?: any;
  schema?: any;

  constructor(
    public auditService: AuditService,
    private toastService: ToastService,
    public route: ActivatedRoute,
  ) {
  }

  ngOnInit(): void {
    this.route.params.pipe(
      switchMap(({aid}) => this.auditService.getSingleAudit(aid))
    ).subscribe((res: any) => {
      this.audit = res.data;
    });

    this.route.params.pipe(
      switchMap(({aid}) => this.auditService.getPercentage(`?percentageType=complete&auditId=${aid}`))
    ).subscribe((res: any) => {
      this.auditService.totalFields = res.totalFields;
      this.auditService.completedFields = res.completedFields;
      this.auditService.progressPercentage = res.percentage + '%';
    });
  }

  uploadPhoto(file: File) {
    const formData = new FormData();
    formData.append('auditId', this.route.snapshot.params.aid);
    formData.append('photo', file, file.name);
    this.auditService.uploadPhoto(this.route.snapshot.params.aid, formData).subscribe(() => {
      this.toastService.success('Upload Audit Photo', 'Successfully uploaded photo for Audit.');
    });
  }
}
