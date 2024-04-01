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
    ).subscribe(res => {
      this.equipmentService.equipments = res.data;
    });

    this.getZonePercentage();
  }

  getZonePercentage() {
    this.route.params.pipe(
      switchMap(({zid}) => this.auditService.getPercentage(`?percentageType=zone&zoneId=${zid}`)),
    ).subscribe(res => {
      this.auditService.equipmentHeadingValue = 'Zone';
      this.auditService.currentProgress = res;
    });
  }

  public getEquipmentPercentage(equipment: any) {
    this.auditService.equipmentHeadingValue = equipment.equipmentName;
    this.auditService
      .getPercentage(`?percentageType=equipment&zoneId=${this.route.snapshot.params.zid}&equipmentId=${equipment.id}`)
      .subscribe(res => this.auditService.currentProgress = res);
  }

  uploadPhoto(file: File) {
    const {aid, zid} = this.route.snapshot.params;
    const formData = new FormData();
    formData.append('auditId', aid);
    formData.append('zoneId', zid);
    formData.append('photo', file, file.name);
    this.auditService.uploadPhoto(aid, formData).subscribe(() => {
      this.toastService.success('Upload Zone Photo', `Sucessfully uploaded photo for Zone '${this.zone?.zoneName}'.`)
    });
  }
}
