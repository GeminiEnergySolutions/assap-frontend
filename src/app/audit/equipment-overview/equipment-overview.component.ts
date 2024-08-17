import {Component, OnInit} from '@angular/core';
import {AuditService} from '../../shared/services/audit.service';
import {ActivatedRoute} from '@angular/router';
import {switchMap} from 'rxjs';
import {Audit, AuditDetails} from '../../shared/model/audit.interface';
import {AuditZoneService} from '../../shared/services/audit-zone.service';
import {Zone} from '../../shared/model/zone.interface';

@Component({
  selector: 'app-equipment-overview',
  templateUrl: './equipment-overview.component.html',
  styleUrl: './equipment-overview.component.scss'
})
export class EquipmentOverviewComponent implements OnInit {
  details?: AuditDetails;
  zones: Zone[] = [];
  zonesById: Record<number, Zone> = {};

  readonly sections: [string, keyof AuditDetails][] = [
    ['HVAC', 'HVAC'],
    ['Water Heating', 'WaterHeater'],
    ['Lighting', 'Lighting'],
    ['Refrigeration', 'Refrigeration'],
    ['Kitchen Equipment', 'KitchenEquipment'],
  ];

  constructor(
    private auditService: AuditService,
    private zoneService: AuditZoneService,
    private route: ActivatedRoute,
    ) {
  }

  ngOnInit() {
    this.route.params.pipe(
      switchMap(({aid}) => this.auditService.getAuditDetails(aid)),
    ).subscribe(({data}) => {
      this.details = data;
    });
    this.route.params.pipe(
      switchMap(({aid}) => this.zoneService.getAllAuditZone(aid)),
    ).subscribe(({data}) => {
      this.zones = data;
      this.zonesById = Object.fromEntries(data.map((zone: Zone) => [zone.zoneId, zone]));
    });
  }
}
