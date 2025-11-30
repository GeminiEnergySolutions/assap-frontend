import {TitleCasePipe} from '@angular/common';
import {Component, inject, OnInit} from '@angular/core';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {switchMap} from 'rxjs';

import {MasterDetailComponent} from '../../shared/components/master-detail/master-detail.component';
import {icons} from '../../shared/icons';
import {Audit} from '../../shared/model/audit.interface';
import {EquipmentCategory} from '../../shared/model/equipment.interface';
import {Zone} from '../../shared/model/zone.interface';
import {AuditZoneService} from '../../shared/services/audit-zone.service';
import {AuditService} from '../../shared/services/audit.service';
import {Breadcrumb, BreadcrumbService} from '../../shared/services/breadcrumb.service';
import {EquipmentService} from '../../shared/services/equipment.service';
import {EquipmentListComponent} from '../equipment-list/equipment-list.component';

@Component({
  selector: 'app-equipment-master-detail',
  templateUrl: './equipment-master-detail.component.html',
  styleUrls: ['./equipment-master-detail.component.scss'],
  imports: [
    MasterDetailComponent,
    RouterLink,
    EquipmentListComponent,
    TitleCasePipe,
  ],
})
export class EquipmentMasterDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private auditService = inject(AuditService);
  private auditZoneService = inject(AuditZoneService);
  private breadcrumbService = inject(BreadcrumbService);
  private equipmentService = inject(EquipmentService);

  audit?: Audit;
  zone?: Zone;
  equipment?: EquipmentCategory;

  ngOnInit(): void {
    const auditBreadcrumb: Breadcrumb = {label: '', class: icons.audit, routerLink: '../../../..', relativeTo: this.route};
    const zoneBreadcrumb: Breadcrumb = {label: '', class: icons.zone, routerLink: '../..', relativeTo: this.route};
    const equipmentBreadcrumb: Breadcrumb = {label: '', routerLink: '.', relativeTo: this.route};
    this.breadcrumbService.setBreadcrumbs([
      {label: 'Audits', routerLink: '../../../../..', relativeTo: this.route},
      auditBreadcrumb,
      {label: 'Zones', routerLink: '../../..', relativeTo: this.route},
      zoneBreadcrumb,
      equipmentBreadcrumb,
    ]);

    this.route.params.pipe(
      switchMap(({aid}) => this.auditService.getSingleAudit(aid)),
    ).subscribe(({data}) => {
      this.audit = data;
      auditBreadcrumb.label = data.auditName;
    });

    this.route.params.pipe(
      switchMap(({aid, zid}) => this.auditZoneService.getSingleZone(aid, zid)),
    ).subscribe(({data}) => {
      this.zone = data;
      zoneBreadcrumb.label = data.zoneName;
    });

    this.route.params.pipe(
      switchMap(({eid}) => this.equipmentService.getEquipmentCategory(eid)),
    ).subscribe(({data}) => {
      this.equipment = data;
      equipmentBreadcrumb.label = data.equipmentName;
    });
  }
}
