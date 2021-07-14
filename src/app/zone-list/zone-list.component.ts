import {Component, Input, OnInit} from '@angular/core';
import {AuditService} from '../audit.service';
import {Audit, Zone} from '../model/audit.interface';

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
  ) {
  }

  createZone() {
    const name = prompt('New Zone Name');
    if (!name) {
      return;
    }

    this.auditService.createZone(this.audit, {name}).subscribe(zone => {
      this.audit.zone[zone.id] = zone;
    });
  }

  rename(zone: Zone) {
    const name = prompt('Rename Zone', zone.name);
    if (!name) {
      return;
    }
    this.auditService.updateZone(this.audit, zone.id, {name}).subscribe(() => {
      zone.name = name;
    });
  }
}
