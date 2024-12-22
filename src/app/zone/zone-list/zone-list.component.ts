import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {switchMap} from 'rxjs';
import {AuditZoneService} from 'src/app/shared/services/audit-zone.service';
import {Zone} from '../../shared/model/zone.interface';

@Component({
  selector: 'app-zone-list',
  templateUrl: './zone-list.component.html',
  styleUrls: ['./zone-list.component.scss'],
})
export class ZoneListComponent implements OnInit {

  zones: Zone[] = [];

  constructor(
    private route: ActivatedRoute,
    private zoneService: AuditZoneService,
  ) {
  }

  ngOnInit(): void {
    this.route.params.pipe(
      switchMap(({aid}) => this.zoneService.getAllAuditZone(aid)),
    ).subscribe(({data}) => {
      this.zones = data;
    });
  }

  create(): void {
    const name = prompt('New Zone Name');
    if (!name) {
      return;
    }

    this.zoneService.createAuditZone({
      auditId: this.route.snapshot.params.aid,
      zoneName: name,
    }).subscribe(({data}) => {
      this.zones.push(data);
    });
  }

  rename(zone: Zone) {
    const name = prompt('Rename Zone ', zone.zoneName);
    if (!name) {
      return;
    }
    this.zoneService.updateAuditZone(zone.auditId, zone.zoneId, {
      ...zone, zoneName: name,
    }).subscribe(({data}) => {
      const index = this.zones.indexOf(zone);
      this.zones[index] = data;
    });
  }

  delete(zone: Zone) {
    if (!confirm(`Are you sure you want to delete '${zone.zoneName}'?`)) {
      return;
    }
    this.zoneService.deleteAuditZone(zone.auditId, zone.zoneId).subscribe(() => {
      const index = this.zones.findIndex(a => a.zoneId === zone.zoneId);
      this.zones.splice(index, 1);
    });
  }

  duplicate(zone: Zone) {
    const count = prompt('How many duplicates?', '1');
    if (!count || isNaN(+count)) {
      return;
    }
    this.zoneService.duplicateAuditZone(zone.zoneId, +count).subscribe(response => {
      this.zones.push(...response.data);
    });
  }
}
