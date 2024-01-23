import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastService } from 'ng-bootstrap-ext';
import { switchMap } from 'rxjs';
import { AuditZoneService } from 'src/app/shared/services/audit-zone.service';
import { AuditService } from 'src/app/shared/services/audit.service';
import { CaptureService } from 'src/app/shared/services/capture.service';
import { EquipmentService } from 'src/app/shared/services/equipment.service';

@Component({
  selector: 'app-zone',
  templateUrl: './zone.component.html',
  styleUrls: ['./zone.component.scss']
})
export class ZoneComponent implements OnInit {

  zone: any;

  constructor(private auditZoneService: AuditZoneService,
    private cameraService: CaptureService,
    public auditService: AuditService,
    public equipmentService: EquipmentService,
    public route: ActivatedRoute,
    private toastService: ToastService,
  ) { }

  ngOnInit(): void {
    this.route.params.pipe(
      switchMap(({ aid, zid }) => this.auditZoneService.getSingleZone(zid)),
    ).subscribe((zone: any) => {
      this.zone = zone.data;
    });

    this.route.params.pipe(
      switchMap(({ aid, zid }) => this.equipmentService.getAllEquipments()),
    ).subscribe((res: any) => {
      this.equipmentService.equipments = res.data;
    });

    this.route.params
      .pipe(
        switchMap(({ aid, zid }) => {
          return this.auditService.calculatePercentageZone(aid, zid);
        })
      )
      .subscribe((res: any) => {
        this.auditService.equipmentHeadingValue = 'Zone';
        this.auditService.progressPercentageZone = res.progressPercentageZone + '%';
        this.auditService.zoneTotalFields = res.zoneTotalFields;
        this.auditService.zoneRemainingFields = res.zoneRemainingFields;
      });
  }

  public getEquipmentPercentage(equipment: any) {
    this.auditService.equipmentHeadingValue = equipment.equipmentName;
    this.auditService.getEquipmentTypesPercentage(this.route.snapshot.params.aid, this.route.snapshot.params.zid, equipment.id).subscribe((res: any) => {
      this.auditService.progressPercentageZone = res.progressPercentageZone + '%';
      this.auditService.zoneTotalFields = res.zoneTotalFields;
      this.auditService.zoneRemainingFields = res.zoneRemainingFields;
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
      this.auditService.uploadPhoto(this.route.snapshot.params.aid, formData).subscribe((res: any) => {
        this.toastService.success('Success', 'Photo have been saved.')
      });
    }
  }

}
