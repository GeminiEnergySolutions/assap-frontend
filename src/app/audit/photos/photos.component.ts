import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AuditZoneService} from 'src/app/shared/services/audit-zone.service';
import {EquipmentService} from 'src/app/shared/services/equipment.service';
import {Equipment, EquipmentCategory} from '../../shared/model/equipment.interface';
import {Zone} from '../../shared/model/zone.interface';
import {Photo, PhotoQuery} from '../../shared/model/photo.interface';
import {map, of, switchMap} from 'rxjs';
import {PhotoService} from '../../shared/services/photo.service';

@Component({
  selector: 'app-photos',
  templateUrl: './photos.component.html',
  styleUrls: ['./photos.component.scss'],
  standalone: false,
})
export class PhotosComponent implements OnInit {

  photoType = 'All';
  zoneList: Zone[] = [];
  equipmentList: EquipmentCategory[] = [];
  subTypeList: Equipment[] = [];

  query: PhotoQuery = {
    auditId: 0,
    pageNo: 1,
    size: 10,
  };
  totalCount = 0;

  photos: Photo[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private photoService: PhotoService,
    private auditZoneService: AuditZoneService,
    private equipmentService: EquipmentService,
  ) {
  }

  ngOnInit() {
    this.route.queryParams.pipe(
      map(query => Object.assign(this.query, query, {auditId: +this.route.snapshot.params.aid})),
      switchMap(query => this.photoService.getPhotos(query)),
    ).subscribe(({data}) => {
      this.photos = data.photos;
      this.totalCount = data.count_total_photos;
    });

    this.route.params.pipe(
      switchMap(({aid}) => this.auditZoneService.getAllAuditZone(+aid)),
    ).subscribe(({data}) => {
      this.zoneList = data;
    });

    this.route.queryParams.pipe(
      switchMap(({zoneId, equipmentId}) => zoneId && equipmentId ? this.equipmentService.getEquipments(zoneId, equipmentId) : of({data: []})),
    ).subscribe(({data}) => {
      this.subTypeList = data;
    });

    this.equipmentService.getEquipmentCategories().subscribe(res => {
      this.equipmentList = res.data;
    });
  }

  updateQuery(update: Partial<PhotoQuery>) {
    Object.assign(this.query, update);
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: this.query,
      queryParamsHandling: 'replace',
    });
  }

  changeEquipmentAll(equipmentId: number) {
    this.updateQuery({
      pageNo: 1,
      zoneId: undefined,
      equipmentId,
      typeId: undefined,
    });
  }

  changePhotoType() {
    this.updateQuery({
      pageNo: 1,
      zoneId: undefined,
      equipmentId: undefined,
      typeId: undefined,
    });
  }

  changeZone(zoneId: number) {
    this.updateQuery({
      pageNo: 1,
      zoneId,
      equipmentId: undefined,
      typeId: undefined,
    });
  }

  changeEquipment(equipmentId: number) {
    this.updateQuery({
      pageNo: 1,
      equipmentId,
      typeId: undefined,
    });
  }

  changeSubType(typeId: number) {
    this.updateQuery({
      pageNo: 1,
      typeId,
    });
  }

  deletePhoto(id: number) {
    this.photoService.deletePhoto(id).subscribe(() => {
      this.photos = this.photos.filter(photo => photo.id !== id);
      this.totalCount--;
    });
  }
}
