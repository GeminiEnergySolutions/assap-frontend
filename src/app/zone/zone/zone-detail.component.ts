import {TitleCasePipe} from '@angular/common';
import {AfterViewInit, Component, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {ToastService} from '@mean-stream/ngbx';
import {switchMap, tap} from 'rxjs';

import {FeatureCardComponent} from '../../shared/components/feature-card/feature-card.component';
import {PhotoCaptureComponent} from '../../shared/components/photo-capture/photo-capture.component';
import {ProgressBarComponent} from '../../shared/components/progress-bar/progress-bar.component';
import {icons} from '../../shared/icons';
import {Audit} from '../../shared/model/audit.interface';
import {EquipmentCategory} from '../../shared/model/equipment.interface';
import {PercentageCompletion} from '../../shared/model/percentage-completion.interface';
import {Zone} from '../../shared/model/zone.interface';
import {AuditZoneService} from '../../shared/services/audit-zone.service';
import {AuditService} from '../../shared/services/audit.service';
import {Breadcrumb, BreadcrumbService} from '../../shared/services/breadcrumb.service';
import {EquipmentService} from '../../shared/services/equipment.service';
import {PhotoService} from '../../shared/services/photo.service';
import {ZoneOptionsDropdownComponent} from '../zone-options-dropdown/zone-options-dropdown.component';

@Component({
  selector: 'app-zone-detail',
  templateUrl: './zone-detail.component.html',
  styleUrls: ['./zone-detail.component.scss'],
  imports: [
    RouterLink,
    ProgressBarComponent,
    FeatureCardComponent,
    PhotoCaptureComponent,
    TitleCasePipe,
    ZoneOptionsDropdownComponent,
  ],
})
export class ZoneDetailComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('options', {static: true}) options!: TemplateRef<any>;

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

  ngAfterViewInit() {
    this.breadcrumbService.options = this.options;
  }

  ngOnDestroy() {
    this.breadcrumbService.popBreadcrumb();
    this.breadcrumbService.options = undefined;
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
