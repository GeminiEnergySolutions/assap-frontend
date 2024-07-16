import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {AuditService} from 'src/app/shared/services/audit.service';
import {AuditZoneService} from 'src/app/shared/services/audit-zone.service';
import {EquipmentService} from 'src/app/shared/services/equipment.service';
import {Equipment, EquipmentCategory} from '../../shared/model/equipment.interface';
import {Zone} from '../../shared/model/zone.interface';
import {Photo} from '../../shared/model/photo.interface';

@Component({
  selector: 'app-photos',
  templateUrl: './photos.component.html',
  styleUrls: ['./photos.component.scss'],
})
export class PhotosComponent implements OnInit {

  photoType: string = 'All';
  zoneList: Zone[] = [];
  zone?: number;
  equipmentList: EquipmentCategory[] = [];
  equipment?: number;
  subTypeList: Equipment[] = [];
  subType?: number;

  page = 0;
  size = 10;
  totalCount = 0;

  photos: Photo[] = [];

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
    this.auditZoneService.getAllAuditZone(this.route.snapshot.params.aid).subscribe(res => {
      this.zoneList = res.data;
    });
  }

  getPhotos() {
    this.auditService.getPhotos(this.route.snapshot.params.aid, this.page + 1, this.size, {
      zoneId: this.zone,
      equipmentId: this.equipment,
      typeId: this.subType,
    }).subscribe(response => {
      this.photos = response.data.photos;
      this.totalCount = response.data.count_total_photos;
    });
  }

  changeEquipmentAll() {
    this.getPhotos();
  }

  changePhotoType() {
    this.zone = undefined;
    this.equipment = undefined;
    this.subTypeList = [];
    this.subType = undefined;
    this.page = 0;

    this.getPhotos();
  }

  changeZone() {
    this.equipment = undefined;
    this.page = 0;
    this.getPhotos();
  }

  changeEquipment() {
    this.subType = undefined;
    this.subTypeList = [];
    this.page = 0;

    this.equipment && this.equipmentService.getEquipments(this.zone!, this.equipment).subscribe(res => {
      this.subTypeList = res;
    });
    this.getPhotos();
  }

  changeSubType() {
    this.page = 0;
    this.getPhotos();
  }

  deletePhoto(id: number) {
    this.auditService.deletePhoto(id).subscribe(() => {
      this.photos = this.photos.filter(photo => photo.id !== id);
    });
  }
}
