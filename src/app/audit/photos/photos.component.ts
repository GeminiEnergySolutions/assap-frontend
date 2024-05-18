import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {AuditService} from 'src/app/shared/services/audit.service';
import {AuditZoneService} from 'src/app/shared/services/audit-zone.service';
import {EquipmentService} from 'src/app/shared/services/equipment.service';
import {MatPaginator} from '@angular/material/paginator';
import {Equipment, EquipmentCategory} from '../../shared/model/equipment.interface';

@Component({
  selector: 'app-photos',
  templateUrl: './photos.component.html',
  styleUrls: ['./photos.component.scss'],
})
export class PhotosComponent implements OnInit {

  @ViewChild(MatPaginator, {static: false}) paginator: any;

  photoType: string = 'All';
  zoneList: any = [];
  zone: number = 0;
  equipmentList: EquipmentCategory[] = [];
  equipment: number = 0;
  subTypeList: Equipment[] = [];
  subType: number = 0;
  data: any = [];
  data2 = [];
  dataForLength = [];

  page = 0;
  size = 8;

  constructor(
    private route: ActivatedRoute,
    private auditService: AuditService,
    private auditZoneService: AuditZoneService,
    private equipmentService: EquipmentService,
  ) {
  }

  ngOnInit() {
    this.getPhotos();
    this.equipmentService.getEquipmentCategories().subscribe(res => {
      this.equipmentList = res.data;
    });
  }

  getPhotos() {
    this.auditService.getPhotos(this.route.snapshot.params.aid).subscribe((photos: any) => {
      this.data2 = photos.data;
      this.getData({pageIndex: this.page, pageSize: this.size});
    });
  }

  updatePhotosFilter() {
    this.getData({pageIndex: 0, pageSize: 8});
  }

  getData(obj: any) {

    let index = 0,
      startingIndex = obj.pageIndex * obj.pageSize,
      endingIndex = startingIndex + obj.pageSize;

    if (this.photoType === 'Audit') {
      this.dataForLength = this.data2.filter((a: any) => !a.zoneId && !a.equipmentId);
      this.data = this.dataForLength.filter((a: any) => {
        index++;
        return (index > startingIndex && index <= endingIndex && !a.zoneId && !a.equipmentId);
      });
    } else if (this.photoType === 'Zone') {

      if (this.subType) {
        this.dataForLength = this.data2.filter((a: any) => a.zoneId === Number(this.zone) && a.equipmentId === Number(this.equipment) && a.subTypeId === Number(this.subType));
        this.data = this.dataForLength.filter((a: any) => {
          index++;
          return (index > startingIndex && index <= endingIndex && a.zoneId === Number(this.zone) && a.equipmentId === Number(this.equipment) && a.subTypeId === Number(this.subType));
        });
      } else if (this.equipment) {
        this.dataForLength = this.data2.filter((a: any) => a.zoneId === Number(this.zone) && a.equipmentId === Number(this.equipment));
        this.data = this.dataForLength.filter((a: any) => {
          index++;
          return (index > startingIndex && index <= endingIndex && a.zoneId === Number(this.zone) && a.equipmentId === Number(this.equipment));
        });
      } else if (this.zone) {
        this.dataForLength = this.data2.filter((a: any) => a.zoneId === Number(this.zone) && !a.equipmentId);
        this.data = this.dataForLength.filter((a: any) => {
          index++;
          return (index > startingIndex && index <= endingIndex && a.zoneId === Number(this.zone) && !a.equipmentId);
        });
      } else {
        this.dataForLength = this.data2.filter((a: any) => a.zoneId && !a.equipmentId);
        this.data = this.dataForLength.filter((a: any) => {
          index++;
          return !!(index > startingIndex && index <= endingIndex && a.zoneId && !a.equipmentId);
        });
      }

    } else {
      if (this.equipment) {
        this.dataForLength = this.data2.filter((a: any) => a.equipmentId === Number(this.equipment));
        this.data = this.dataForLength.filter((a: any) => {
          index++;
          return (index > startingIndex && index <= endingIndex && a.equipmentId === Number(this.equipment));
        });
      } else {
        this.dataForLength = this.data2;
        this.data = this.dataForLength.filter((a: any) => {
          index++;
          return (index > startingIndex && index <= endingIndex);
        });
      }
    }
  }

  changePhotoType() {
    this.zoneList = [];
    this.zone = 0;
    this.equipment = 0;
    this.subTypeList = [];
    this.subType = 0;

    if (this.photoType === 'Zone') {
      this.getAllAuditZone(this.route.snapshot.params.aid);
    }
    this.getPhotos();
    // this.getData({ pageIndex: 0, pageSize: 8 });
  }

  getAllAuditZone(auditId: number) {
    this.auditZoneService.getAllAuditZone(auditId).subscribe((res: any) => {
      this.zoneList = res.data;
    });
  }

  changeZone() {
    this.equipment = 0;
    this.getData({pageIndex: 0, pageSize: 8});

  }

  changeEquipment() {
    this.subType = 0;
    this.subTypeList = [];

    this.getData({pageIndex: 0, pageSize: 8});

    this.getEquipmentSubTypes(this.equipment);
  }

  getEquipmentSubTypes(equipmentId: number) {
    this.equipmentService.getEquipments(this.zone, equipmentId).subscribe(res => {
      this.subTypeList = res;
    });
  }

  changeSubType() {
    this.getData({pageIndex: 0, pageSize: 8});
  }
}
