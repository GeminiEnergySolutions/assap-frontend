import {Component, Input} from '@angular/core';
import {AuditService} from '../audit.service';
import {FeatureService} from '../feature.service';
import {Audit, Zone} from '../model/audit.interface';
import {ZoneService} from '../zone.service';

@Component({
  selector: 'app-zone-list',
  templateUrl: './zone-list.component.html',
  styleUrls: ['./zone-list.component.scss'],
})
export class ZoneListComponent {
  @Input() audit: Audit;
  @Input() routerPrefix = '';

  constructor(
    private auditService: AuditService,
    private zoneService: ZoneService,
    private featureService: FeatureService,
  ) {
  }

  createZone() {
    const name = prompt('New Zone Name');
    if (!name) {
      return;
    }

    this.zoneService.create(this.audit, {name}).subscribe(zone => {
      this.audit.zone[zone.id] = zone;
    });
  }

  rename(zone: Zone) {
    const name = prompt('Rename Zone', zone.name);
    if (!name) {
      return;
    }
    this.zoneService.update(this.audit, zone.id, {name}).subscribe(() => {
      zone.name = name;
    });
  }

  delete(zone: Zone) {
    if (!confirm(`Are you sure you want to delete '${zone.name}'?`)) {
      return;
    }
    this.zoneService.delete(this.audit, zone).subscribe(() => {
      delete this.audit.zone[zone.id];
      for (const id of zone.typeId) {
        delete this.audit.type[id];
      }
    });
    this.featureService.deleteAll({zoneId: zone.id.toString()}).subscribe();
  }
}
