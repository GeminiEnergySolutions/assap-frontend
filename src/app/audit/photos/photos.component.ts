import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {AuditZoneService} from 'src/app/shared/services/audit-zone.service';
import {EquipmentService} from 'src/app/shared/services/equipment.service';
import {Equipment, EquipmentCategory} from '../../shared/model/equipment.interface';
import {Zone} from '../../shared/model/zone.interface';
import {Photo, PhotoQuery} from '../../shared/model/photo.interface';
import {map, of, switchMap, withLatestFrom} from 'rxjs';
import {PhotoService} from '../../shared/services/photo.service';
import {NgbDropdown, NgbDropdownMenu, NgbDropdownToggle, NgbPagination, NgbTooltip} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule} from '@angular/forms';
import {UpperCasePipe} from '@angular/common';

@Component({
  selector: 'app-photos',
  templateUrl: './photos.component.html',
  styleUrls: ['./photos.component.scss'],
  imports: [
    RouterLink,
    NgbDropdown,
    NgbDropdownToggle,
    NgbDropdownMenu,
    FormsModule,
    NgbTooltip,
    NgbPagination,
    UpperCasePipe,
  ],
})
export class PhotosComponent implements OnInit {
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
    protected route: ActivatedRoute,
    private photoService: PhotoService,
    private auditZoneService: AuditZoneService,
    private equipmentService: EquipmentService,
  ) {
  }

  ngOnInit() {
    this.route.queryParams.pipe(
      withLatestFrom(this.route.params),
      map(([query, path]) => Object.assign(this.query, {
        auditId: +path.aid || undefined,
        zoneId: +path.zid || +query.zoneId || undefined,
        equipmentId: +query.equipmentId || undefined,
        typeId: +query.typeId || undefined,
        pageNo: +query.pageNo || 1,
        size: +query.size || 10,
      })),
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
    const queryParams = Object.fromEntries(Object.entries(this.query).filter(([_, v]) => v !== undefined && v !== null && v !== ''));
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
      queryParamsHandling: 'replace',
    });
  }

  changeZone(zoneId: number | undefined) {
    this.updateQuery({
      pageNo: 1,
      zoneId,
    });
  }

  changeEquipment(equipmentId: number | undefined) {
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
    this.photoService.deletePhoto(+this.route.snapshot.params.aid, id).subscribe(() => {
      this.photos = this.photos.filter(photo => photo.id !== id);
      this.totalCount--;
    });
  }
}
