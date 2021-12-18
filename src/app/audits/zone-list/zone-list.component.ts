import {Component, Input} from '@angular/core';
import {ToastService} from 'ng-bootstrap-ext';
import {forkJoin} from 'rxjs';
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
  @Input() audit!: Audit;
  @Input() routerPrefix = '';

  constructor(
    private auditService: AuditService,
    private zoneService: ZoneService,
    private featureService: FeatureService,
    private toastService: ToastService,
  ) {
  }

  createZone() {
    const name = prompt('New Zone Name');
    if (!name) {
      return;
    }

    this.zoneService.create(this.audit, {name}).subscribe(zone => {
      this.audit.zone[zone.id] = zone;
    }, error => {
      this.toastService.error('Zone', 'Failed to create zone', error);
    });
  }

  rename(zone: Zone) {
    const name = prompt('Rename Zone', zone.name);
    if (!name) {
      return;
    }
    this.zoneService.update(this.audit, zone.id, {name}).subscribe(() => {
      zone.name = name;
    }, error => {
      this.toastService.error('Zone', 'Failed to rename zone', error);
    });
  }

  delete(zone: Zone) {
    if (!confirm(`Are you sure you want to delete '${zone.name}'?`)) {
      return;
    }
    forkJoin([
      this.zoneService.delete(this.audit, zone),
      this.featureService.deleteAll({zoneId: zone.id.toString()}),
    ]).subscribe(undefined, error => {
      this.toastService.error('Zone', 'Failed to delete zone', error);
    });
  }
}
