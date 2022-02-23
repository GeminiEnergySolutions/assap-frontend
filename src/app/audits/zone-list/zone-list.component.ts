import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ToastService} from 'ng-bootstrap-ext';
import {forkJoin} from 'rxjs';
import {switchMap} from 'rxjs/operators';
import {AuditService} from '../audit.service';
import {FeatureService} from '../feature.service';
import {Audit, MinAuditKeys, Zone} from '../model/audit.interface';
import {ZoneService} from '../zone.service';

type MyAudit = Pick<Audit, MinAuditKeys>;

@Component({
  selector: 'app-zone-list',
  templateUrl: './zone-list.component.html',
  styleUrls: ['./zone-list.component.scss'],
})
export class ZoneListComponent implements OnInit {
  audit?: MyAudit;
  zones?: Zone[];

  constructor(
    private route: ActivatedRoute,
    private auditService: AuditService,
    private zoneService: ZoneService,
    private featureService: FeatureService,
    private toastService: ToastService,
  ) {
  }

  ngOnInit() {
    this.route.params.pipe(
      switchMap(({aid}) => this.auditService.findOne(aid, ['zone'])),
    ).subscribe(audit => {
      this.audit = audit;
      this.zones = Object.values(audit?.zone ?? {});
    });
  };

  createZone() {
    const name = prompt('New Zone Name');
    if (!name) {
      return;
    }

    this.zoneService.create(this.audit!, {name}).subscribe(zone => {
      this.zones?.push(zone);
    }, error => {
      this.toastService.error('Zone', 'Failed to create zone', error);
    });
  }

  rename(zone: Zone) {
    const name = prompt('Rename Zone', zone.name);
    if (!name) {
      return;
    }
    this.zoneService.update(this.audit!, zone.id, {name}).subscribe(() => {
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
      this.zoneService.delete(this.audit!, zone),
      this.featureService.deleteAll({zoneId: zone.id.toString()}),
    ]).subscribe(() => {
      if (!this.zones) {
        return;
      }

      const index = this.zones.indexOf(zone);
      if (index >= 0) {
        this.zones.splice(index, 1);
      }
    }, error => {
      this.toastService.error('Zone', 'Failed to delete zone', error);
    });
  }
}
