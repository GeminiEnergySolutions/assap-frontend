import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {ActivatedRoute} from '@angular/router';
import {AuditService} from 'src/app/shared/services/audit.service';
import {AuthService} from 'src/app/shared/services/auth.service';
import {environment} from 'src/environments/environment.prod';

@Component({
  selector: 'app-generate-report-dialog',
  templateUrl: './generate-report-dialog.component.html',
  styleUrls: ['./generate-report-dialog.component.scss'],
})
export class GenerateReportDialogComponent {
  formData: any = { type: 'energyAudit' };
  tabType: string = 'energyAudit';
  serverUrl?: string = environment.url + "api/";

  constructor(
    private dialogRef: MatDialogRef<GenerateReportDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    public auditService: AuditService,
    private authService: AuthService,
    private route: ActivatedRoute
  ) {
    this.auditService.isCompleted = true;
  }

  changeNav(type: any) {
    if (this.tabType !== type) {
      this.formData = { type };
      this.tabType = type;
    }
  }

  onCloseDialog() {
    this.dialogRef.close(this.formData);
  }

  onClose() {
    this.dialogRef.close();
  }

  reportType = "auditEnergy";
  generateReport(type: string) {
    window.location.href = this.serverUrl + type + '?auditId=' + this.dialogData.auditId + '&auth_token=' + this.authService.getAuthToken();
  }
}
