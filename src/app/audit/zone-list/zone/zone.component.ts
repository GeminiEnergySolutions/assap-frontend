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
          const queryParams = `?percentageType=zone&zoneId=${this.route.snapshot.params.zid}`;
          return this.auditService.getPercentage(queryParams);
        })
      )
      .subscribe((res: any) => {
        this.auditService.equipmentHeadingValue = 'Zone';
        this.auditService.totalFields = res.totalFields ;
        this.auditService.completedFields = res.completedFields ;
        this.auditService.progressPercentage = res.percentage + '%';
      });
  }

  public getEquipmentPercentage(equipment: any) {
    this.auditService.equipmentHeadingValue = equipment.equipmentName;
    const queryParams = `?percentageType=equipment&zoneId=${this.route.snapshot.params.zid}&equipmentId=${equipment.id}`;
    this.auditService.getPercentage(queryParams).subscribe((res: any) => {
      this.auditService.totalFields = res.totalFields ;
      this.auditService.completedFields = res.completedFields ;
      this.auditService.progressPercentage = res.percentage + '%';
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
