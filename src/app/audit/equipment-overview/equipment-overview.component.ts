import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {NgbTooltip} from '@ng-bootstrap/ng-bootstrap';
import {switchMap} from 'rxjs';

import {icons} from '../../shared/icons';
import {AuditDetails} from '../../shared/model/audit.interface';
import {Zone} from '../../shared/model/zone.interface';
import {AuditZoneService} from '../../shared/services/audit-zone.service';
import {AuditService} from '../../shared/services/audit.service';
import {Breadcrumb, BreadcrumbService} from '../../shared/services/breadcrumb.service';

@Component({
  selector: 'app-equipment-overview',
  templateUrl: './equipment-overview.component.html',
  styleUrl: './equipment-overview.component.scss',
  imports: [
    RouterLink,
    NgbTooltip,
  ],
})
export class EquipmentOverviewComponent implements OnInit, OnDestroy {
  private auditService = inject(AuditService);
  private zoneService = inject(AuditZoneService);
  private route = inject(ActivatedRoute);
  private breadcrumbService = inject(BreadcrumbService);

  protected readonly icons = icons;

  details?: AuditDetails;
  zones: Zone[] = [];
  zonesById: Partial<Record<number, Zone>> = {};
  zonesWithLighting: Partial<Record<number, true>> = {};

  readonly sections: [string, keyof AuditDetails][] = [
    ['HVAC', 'HVAC'],
    ['Water Heating', 'WaterHeater'],
    ['Lighting', 'Lighting'],
    ['Refrigeration', 'Refrigeration'],
    ['Kitchen Equipment', 'KitchenEquipment'],
  ];

  ngOnInit() {
    const breadcrumb: Breadcrumb = {label: '', class: icons.audit, routerLink: '..', relativeTo: this.route};
    this.breadcrumbService.pushBreadcrumb(breadcrumb);
    this.breadcrumbService.pushBreadcrumb({
      label: 'Overview', class: 'bi-binoculars', routerLink: '.', relativeTo: this.route,
    });

    this.route.params.pipe(
      switchMap(({aid}) => this.auditService.getSingleAudit(aid)),
    ).subscribe(({data}) => {
      breadcrumb.label = data.auditName;
    });

    this.route.params.pipe(
      switchMap(({aid}) => this.auditService.getAuditDetails(aid)),
    ).subscribe(({data}) => {
      this.details = data;
      this.zonesWithLighting = {};
      for (const lighting of data.Lighting.equipment_list) {
        this.zonesWithLighting[lighting.zoneId] = true;
      }
    });
    this.route.params.pipe(
      switchMap(({aid}) => this.zoneService.getAllAuditZone(aid)),
    ).subscribe(({data}) => {
      this.zones = data;
      this.zonesById = Object.fromEntries(data.map((zone: Zone) => [zone.zoneId, zone]));
    });
  }

  ngOnDestroy() {
    this.breadcrumbService.popBreadcrumb();
    this.breadcrumbService.popBreadcrumb();
  }
}
