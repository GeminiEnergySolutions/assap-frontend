import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ToastService} from '@mean-stream/ngbx';
import {switchMap, tap} from 'rxjs';
import {Audit} from '../../shared/model/audit.interface';
import {EquipmentCategory} from '../../shared/model/equipment.interface';
import {PercentageCompletion} from '../../shared/model/percentage-completion.interface';
import {Zone} from '../../shared/model/zone.interface';
import {AuditZoneService} from '../../shared/services/audit-zone.service';
import {AuditService} from '../../shared/services/audit.service';
import {EquipmentService} from '../../shared/services/equipment.service';
import {PhotoService} from '../../shared/services/photo.service';
import {Breadcrumb, BreadcrumbService} from '../../shared/services/breadcrumb.service';
import {icons} from '../../shared/icons';

@Component({
  selector: 'app-zone-detail',
  templateUrl: './zone-detail.component.html',
  styleUrls: ['./zone-detail.component.scss'],
  standalone: false,
})
export class ZoneDetailComponent implements OnInit, OnDestroy {
  audit?: Audit;
  zone?: Zone;
  equipments: EquipmentCategory[] = [];
  progress?: PercentageCompletion;

  constructor(
    private auditZoneService: AuditZoneService,
    private auditService: AuditService,
    private photoService: PhotoService,
    private equipmentService: EquipmentService,
    public route: ActivatedRoute,
    private toastService: ToastService,
    private breadcrumbService: BreadcrumbService,
  ) {
  }

  ngOnInit(): void {
    const breadcrumb: Breadcrumb = {label: '', class: icons.zone, routerLink: '.', relativeTo: this.route};
    this.breadcrumbService.pushBreadcrumb(breadcrumb);

    this.route.params.pipe(
      switchMap(({aid}) => this.auditService.getSingleAudit(aid)),
    ).subscribe(({data}) => {
      this.audit = data;
    });

    this.route.params.pipe(
      tap(() => {
        this.zone = undefined;
        breadcrumb.label = '';
      }),
      switchMap(({aid, zid}) => this.auditZoneService.getSingleZone(aid, zid)),
    ).subscribe(({data}) => {
      this.zone = data;
      breadcrumb.label = data.zoneName;
    });

    this.equipmentService.getEquipmentCategories().subscribe(res => {
      this.equipments = res.data;
    });

    this.route.params.pipe(
      switchMap(({aid, zid}) => this.auditService.getPercentage({
        progressType: 'zone',
        auditId: aid,
        zoneId: zid,
      })),
    ).subscribe(res => this.progress = res);
  }

  ngOnDestroy() {
    this.breadcrumbService.popBreadcrumb();
  }

  uploadPhoto(file: File) {
    if (!this.zone) {
      return;
    }

    this.photoService.uploadPhoto({
      auditId: this.zone.auditId,
      zoneId: this.zone.zoneId,
    }, file).subscribe(() => {
      this.toastService.success('Upload Zone Photo', `Sucessfully uploaded photo for Zone '${this.zone?.zoneName}'.`);
    });
  }
}
