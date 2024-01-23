import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs';
import { AuditService } from 'src/app/shared/services/audit.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { environment } from 'src/environments/environment.prod';

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
    // this.getUtilityInfo();
    this.auditService.isCompleted = true;
  }

  // getUtilityInfo() {
  //   this.auditService
  //     .getUtilityInfo(this.dialogData.auditId)
  //     .subscribe((res: any) => {
  //       if (res && res.id) {
  //         this.formData = { ...this.formData, ...res };
  //       }
  //     });
  // }

  changeNav(type: any) {
    if (this.tabType !== type) {
      this.formData = { type };
      this.tabType = type;
    }
    // if (type === 'energyAudit') {
    //   this.getUtilityInfo();
    // }
  }

  onCloseDialog() {
    this.dialogRef.close(this.formData);
  }

  onClose() {
    this.dialogRef.close();
  }

  reportType = "auditEnergy";
  generateReport(type: string) {
    // this.reportType = type;
    // let url = this.serverUrl + type + "/" + this.dialogData.auditId + '/'
    window.location.href = this.serverUrl + type + '?auditId=' + this.dialogData.auditId + '&auth_token=' + this.authService.getAuthToken();
    // this.auditService.isCompleted = false;
    // this.route.params.pipe(
    //     switchMap(({ aid }) => {
    //       if (type == "auditEnergy")
    //         return this.auditService.auditEnergyReport(this.dialogData.auditId);
    //       else if (type == "feasibility")
    //         return this.auditService.feasibilityReport(this.dialogData.auditId);
    //       else 
    //         return this.auditService.cehReport(this.dialogData.auditId);
    //     })
    //   ).subscribe((response: Blob) => {
    //     if (!this.isBlob(response)) {
    //       this.auditService.isCompleted = true;
    //       return;
    //     }
    //     let blob : any = null;
    //     if (type != "ceh")
    //       blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
    //     else
    //       blob = new Blob([response], { type: 'text/csv' });

    //     const url = window.URL.createObjectURL(blob);
    //     const a = document.createElement('a');
    //     a.href = url;
    //     a.download = type == "auditEnergy" ? "Energy_Audit_Report.docx" : type == "feasibility" ? "feasibility_report.docx" : "CEH_Microgrid.csv";
    //     document.body.appendChild(a);
    //     a.click();
    //     this.auditService.isCompleted = true;
    //     document.body.removeChild(a);
    //     window.URL.revokeObjectURL(url);
    // });
  }
  // isBlob(variable: any): variable is Blob {
  //   return variable instanceof Blob;
  // }
}
