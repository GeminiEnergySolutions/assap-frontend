import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ToastService} from '@mean-stream/ngbx';
import {switchMap} from 'rxjs';
import {AuditService} from '../shared/services/audit.service';
import {CaptureService} from '../shared/services/capture.service';

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
    private cameraService: CaptureService,
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

  async captureDialog() {
    let newPic: string | any;
    try {
      newPic = await this.cameraService.open();
    } catch (error) {
      this.toastService.error("Error", "Requested Device not found.", error)
    }
    if (newPic) {
      const formData = new FormData();
      formData.append('photo', newPic);
      formData.append('auditId', this.route.snapshot.params.aid);
      this.auditService.uploadPhoto(this.route.snapshot.params.aid, formData).subscribe((res: any) => {
        this.toastService.success('Success', 'Photo have been saved.');
      });
    }
  }
}
