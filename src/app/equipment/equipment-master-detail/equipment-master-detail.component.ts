import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {switchMap} from 'rxjs';
import {AuditZoneService} from 'src/app/shared/services/audit-zone.service';
import {AuditService} from 'src/app/shared/services/audit.service';
import {EquipmentService} from 'src/app/shared/services/equipment.service';
import {EquipmentCategory} from '../../shared/model/equipment.interface';
import {Audit} from '../../shared/model/audit.interface';
import {Zone} from '../../shared/model/zone.interface';
import {BreadcrumbService} from '../../shared/services/breadcrumb.service';
import {icons} from '../../shared/icons';

@Component({
  selector: 'app-equipment-master-detail',
  templateUrl: './equipment-master-detail.component.html',
  styleUrls: ['./equipment-master-detail.component.scss'],
  standalone: false,
})
export class EquipmentMasterDetailComponent implements OnInit {
  audit?: Audit;
  zone?: Zone;
  equipment?: EquipmentCategory;

  constructor(
    private route: ActivatedRoute,
    private auditService: AuditService,
    private auditZoneService: AuditZoneService,
    private breadcrumbService: BreadcrumbService,
    public equipmentService: EquipmentService,
  ) {
  }

  ngOnInit(): void {
    const auditBreadcrumb = {label: '<Audit>', class: icons.audit, routerLink: '../../../..', relativeTo: this.route};
    const zoneBreadcrumb = {label: '<Zone>', class: icons.zone, routerLink: '../..', relativeTo: this.route};
    const equipmentBreadcrumb = {label: '<Equipment>', routerLink: '.', relativeTo: this.route};
    this.breadcrumbService.setBreadcrumbs([
      {label: 'Audits', routerLink: '../../../../..'},
      auditBreadcrumb,
      {label: 'Zones', routerLink: '../../..'},
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
