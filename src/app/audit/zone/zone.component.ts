import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ToastService} from '@mean-stream/ngbx';
import {switchMap} from 'rxjs';
import {AuditZoneService} from 'src/app/shared/services/audit-zone.service';
import {AuditService} from 'src/app/shared/services/audit.service';
import {EquipmentService} from 'src/app/shared/services/equipment.service';

@Component({
  selector: 'app-zone',
  templateUrl: './zone.component.html',
  styleUrls: ['./zone.component.scss']
})
export class ZoneComponent implements OnInit {

  zone: any;

  constructor(
    private auditZoneService: AuditZoneService,
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

    this.getZonePercentage();
  }

  getZonePercentage() {
    this.route.params.pipe(
      switchMap(({zid}) => {
        const queryParams = `?percentageType=zone&zoneId=${zid}`;
        return this.auditService.getPercentage(queryParams);
      })
    ).subscribe((res: any) => {
      this.auditService.equipmentHeadingValue = 'Zone';
      this.auditService.totalFields = res.totalFields;
      this.auditService.completedFields = res.completedFields;
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

  uploadPhoto(files: FileList | null) {
    if (!files || !files.length) {
      return;
    }
    const {aid, zid} = this.route.snapshot.params;
    const formData = new FormData();
    formData.append('auditId', aid);
    formData.append('zoneId', zid);
    formData.append('photo', files[0], files[0].name);
    this.auditService.uploadPhoto(aid, formData).subscribe(() => {
      this.toastService.success('Upload Zone Photo', `Sucessfully uploaded photo for Zone '${this.zone?.zoneName}'.`)
    });
  }
}
