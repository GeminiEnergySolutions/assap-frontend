import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastService } from 'ng-bootstrap-ext';
import { switchMap, tap } from 'rxjs';
import { AuditZoneService } from 'src/app/shared/services/audit-zone.service';
import { AuditService } from 'src/app/shared/services/audit.service';
import { CaptureService } from 'src/app/shared/services/capture.service';
import { EquipmentService } from 'src/app/shared/services/equipment.service';


@Component({
  selector: 'app-type',
  templateUrl: './type.component.html',
  styleUrls: ['./type.component.scss']
})
export class TypeComponent {

  constructor(public equipmentService: EquipmentService,
    private cameraService: CaptureService,
    public auditService: AuditService,
    private route: ActivatedRoute,
    private toastService: ToastService,
  ) { }

  ngOnInit(): void {
    this.route.params
    .pipe(
      switchMap(({ aid, zid, tid }) => {
        return this.auditService.calculatePercentageEquipment(aid, tid, zid);
      })
    )
    .subscribe((res: any) => {
      this.auditService.equipmentTotalFields = res.equipmentTotalFields ;
      this.auditService.equipmentRemainingFields = res.equipmentRemainingFields ;
      this.auditService.progressPercentageEquipment = res.progressPercentageEquipment + '%';
    });

  }

  public async captureDialog() {
    let newPic: string | any;
    try {
      newPic = await this.cameraService.open();
    } catch (error) {
      console.dir(error);
    }
    if (newPic) {
      const formData = new FormData();
      formData.append('photo', newPic);
      formData.append('auditId', this.route.snapshot.params.aid);
      formData.append('zoneId', this.route.snapshot.params.zid);
      formData.append('equipmentId', this.equipmentService.equipmentSubTypeData.equipmentId);
      formData.append('typeId', this.equipmentService.equipmentSubTypeData?.type?.id);
      formData.append('subTypeId', this.route.snapshot.params.tid);
      this.auditService.uploadPhoto(this.route.snapshot.params.aid, formData).subscribe((res: any) => {
        this.toastService.success('Success', 'Photo have been saved.');
      });
    }
  }

}
