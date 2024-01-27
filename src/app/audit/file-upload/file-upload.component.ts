import {Component, Inject} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {AuditService} from 'src/app/shared/services/audit.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss'],
})
export class FileUploadComponent {
  formData: any = { type: 'energyAudit' };
  tabType: string = 'energyAudit';
  auditId: any;
  fileUpdated: boolean = false;
  tempratureFileName: string = '';
  testerDataFileName: string = '';
  pvWattsFileName: string = '';

  constructor(
    private dialogRef: MatDialogRef<FileUploadComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    private auditService: AuditService,
    public route: ActivatedRoute
  ) {
    this.auditId = dialogData.auditId;
  }

  changeNav(type: any) {
    this.formData = { type };
    this.tabType = type;
    this.fileUpdated = false;
    if (type === 'cleanEnergyHub') {
      // this.auditService
      //   .getCleanEnergyHubFileData(Number(this.auditId))
      //   .subscribe((res: any) => {
      //     if (res) {
      //       this.formData = { ...this.formData, ...res };
      //       let str = this.formData.temperature;
      //       str = str.substring(0, str.indexOf('?X-Amz'));
      //       str = str.substring(str.indexOf('files/') + 6);
      //       this.tempratureFileName = str;
      //       str = this.formData.testerEnergyData;
      //       str = str.substring(0, str.indexOf('?X-Amz'));
      //       str = str.substring(str.indexOf('files/') + 6);
      //       this.testerDataFileName = str;
      //       str = this.formData.pvWatts;
      //       str = str.substring(0, str.indexOf('?X-Amz'));
      //       str = str.substring(str.indexOf('files/') + 6);
      //       this.pvWattsFileName = str;
      //     }
      //   });
    }
  }

  onFileChange(event: any, type: string) {
    if (event.target.files.length) {
      if (
        event.target.files[0].type !==
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' &&
        event.target.files[0].type !== 'application/vnd.ms-excel' &&
        event.target.files[0].type !== 'text/csv'
      ) {
        this.formData[type] = null;
        alert('please select only required extenstions');
        this.fileUpdated = false;
        return;
      }
      this.fileUpdated = true;
      const fileData = event.target.files[0];
      this.formData[type] = fileData;
    } else {
      this.formData[type] = null;
    }
  }

  onCloseDialog() {
    this.dialogRef.close(this.formData);
  }

  onClose() {
    this.dialogRef.close();
  }
}
