import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ToastService} from 'ng-bootstrap-ext';
import {switchMap} from 'rxjs';
import {environment} from 'src/environments/environment.prod';
import {FormComponent} from '../shared/form/form.component';
import {AuditService} from '../shared/services/audit.service';
import {CaptureService} from '../shared/services/capture.service';
import {GenerateReportDialogComponent} from './generate-report-dialog/generate-report-dialog.component';
import {MatDialog} from '@angular/material/dialog';

@Component({
  selector: 'app-audit',
  templateUrl: './audit.component.html',
  styleUrls: ['./audit.component.scss'],
})
export class AuditComponent implements OnInit {
  @ViewChild('form', { static: false }) form?: FormComponent;

  // audit?: Pick<Audit, 'name' | 'auditId' | 'ACL'>;
  // audit?: Pick<any, 'auditName' | 'auditId' | 'ACL'>;
  audit?: any;
  feature?: any; //Feature;
  // data?: any;//FeatureData;
  schema?: any; //Schema;
  serverUrl?: string;

  constructor(
    public auditService: AuditService,
    private cameraService: CaptureService,
    private toastService: ToastService,
    public route: ActivatedRoute,

    private dialog: MatDialog
  ) {
    this.serverUrl = environment.url;
  }


  ngOnInit(): void {
    this.route.params
      .pipe(
        switchMap(({ aid }) => {
          return this.auditService.getSingleAudit(aid);
        })
      )
      .subscribe((res: any) => {
        this.audit = res.data;
      });

      this.route.params
      .pipe(
        switchMap(({ aid }) => {
          return this.auditService.calculatePercentage(aid);
        })
      )
      .subscribe((res: any) => {
        this.auditService.progressPercent = res.percentage + '%';
        this.auditService.progressPercentCEH =res.percentageCEH + '%';
      });

    // this.auditService.calculatePercentage(this.route.snapshot.params.aid).subscribe((res :any)=>{
    //   this.progressPercent = res.percentage + '%';
    //   this.progressPercentCEH =res.percentageCEH + '%';
    // });

  }

  isSaved(): boolean {
    return !this.form?.dirty;
  }

  public async captureDialog() {
    let newPic: string | any;
    try {
      newPic = await this.cameraService.open();
    } catch (error) {
      console.dir(error, 'error');
      // console.log(error, 'error')
      this.toastService.error("Requested Device not found.", "Error")
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

  // uploadFileDialog() {
  //   let dialogRef = this.dialog.open(FileUploadComponent, {
  //     width: '500px',
  //     disableClose: true,
  //     data: { auditId: this.route.snapshot.params.aid },
  //   });

  //   dialogRef.afterClosed().subscribe((data: any) => {
  //     if (data) {
  //       const formData = new FormData();
  //       for (let key in data) {
  //         formData.append(key, data[key]);
  //       }
  //       formData.append('auditId', this.route.snapshot.params.aid);
  //       if (data.type === 'energyAudit') {
  //         this.auditService
  //           .uploadEnergyAuditFileData(formData)
  //           .subscribe((res: any) => {
  //             this.toastService.success('Success', 'Files have been saved.');
  //           });
  //       } else {
  //         if (data.id) {
  //           this.auditService
  //             .updateCleanEnergyHubFileData(
  //               formData,
  //               Number(this.route.snapshot.params.aid)
  //             )
  //             .subscribe((res: any) => {
  //               this.toastService.success('Success', 'Data has been updated.');
  //             });
  //         } else {
  //           this.auditService
  //             .createCleanEnergyHubFileData(
  //               formData,
  //               Number(this.route.snapshot.params.aid)
  //             )
  //             .subscribe((res: any) => {
  //               this.toastService.success('Success', 'Data has been saved.');
  //             });
  //         }
  //       }
  //     }
  //   });
  // }

  // save(data: FeatureData) {
  save(data: any) {
    if (!this.audit || !this.schema) {
      return;
    }

    // let op: Observable<Feature>;
    // if (this.feature) {
    //   const update = this.featureService.data2Feature(this.schema, data);
    //   op = this.featureService.update(this.feature, update);
    // } else {
    //   const feature = this.featureService.data2Feature(this.schema, data);
    //   const {auditId, ACL} = this.audit;
    //   op = this.featureService.create({
    //     auditId,
    //     belongsTo: 'preaudit',
    //     mod: new Date().valueOf().toString(),
    //     zoneId: null,
    //     typeId: null,
    //     usn: 0,
    //     ACL,
    //     ...feature,
    //   });
    // }

    // op.subscribe((feature) => {
    //   this.feature = feature;
    //   this.toastService.success('Form', 'Successfully saved form input');
    // }, error => {
    //   this.toastService.error('Form', 'Failed to save form input', error);
    // });
  }
}
