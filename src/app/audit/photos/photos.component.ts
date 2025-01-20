import {DatePipe, UpperCasePipe} from '@angular/common';
import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {
  NgbDropdown,
  NgbDropdownMenu,
  NgbDropdownToggle,
  NgbModal,
  NgbPagination,
  NgbTooltip,
} from '@ng-bootstrap/ng-bootstrap';
import {map, of, switchMap, withLatestFrom} from 'rxjs';

import {icons} from '../../shared/icons';
import {Equipment, EquipmentCategory} from '../../shared/model/equipment.interface';
import {Photo, PhotoQuery} from '../../shared/model/photo.interface';
import {Zone} from '../../shared/model/zone.interface';
import {AuditZoneService} from '../../shared/services/audit-zone.service';
import {AuditService} from '../../shared/services/audit.service';
import {Breadcrumb, BreadcrumbService} from '../../shared/services/breadcrumb.service';
import {EquipmentService} from '../../shared/services/equipment.service';
import {PhotoService} from '../../shared/services/photo.service';

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
    DatePipe,
  ],
})
export class PhotosComponent implements OnInit, OnDestroy {
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
  modalPhoto?: Photo;

  constructor(
    private router: Router,
    protected route: ActivatedRoute,
    private photoService: PhotoService,
    private auditService: AuditService,
    private auditZoneService: AuditZoneService,
    private equipmentService: EquipmentService,
    private breadcrumbService: BreadcrumbService,
    protected ngbModal: NgbModal,
  ) {
  }

  ngOnInit() {
    const prevBreadcrumb: Breadcrumb = {label: '', routerLink: '..', relativeTo: this.route};
    this.breadcrumbService.pushBreadcrumb(prevBreadcrumb);
    this.breadcrumbService.pushBreadcrumb({
      label: 'Photos', class: icons.photo, routerLink: '.', relativeTo: this.route,
    });

    this.route.params.pipe(
      switchMap(({aid, zid, eid, tid}) => {
        if (tid) {
          return this.equipmentService.getEquipment(+zid, +eid, +tid);
        } else if (zid) {
          return this.auditZoneService.getSingleZone(+aid, +zid);
        } else {
          return this.auditService.getSingleAudit(+aid);
        }
      }),
    ).subscribe(({data}) => {
      if ('name' in data) {
        prevBreadcrumb.label = data.name;
        prevBreadcrumb.class = icons.equipment;
      } else if ('zoneName' in data) {
        prevBreadcrumb.label = data.zoneName;
        prevBreadcrumb.class = icons.zone;
      } else if ('auditName' in data) {
        prevBreadcrumb.label = data.auditName;
        prevBreadcrumb.class = icons.audit;
      }
    });

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

  ngOnDestroy() {
    this.breadcrumbService.popBreadcrumb();
    this.breadcrumbService.popBreadcrumb();
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
