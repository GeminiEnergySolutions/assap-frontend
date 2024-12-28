import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {switchMap} from 'rxjs';
import {AuditZoneService} from 'src/app/shared/services/audit-zone.service';
import {Zone} from '../../shared/model/zone.interface';
import {ToastService} from '@mean-stream/ngbx';

@Component({
  selector: 'app-zone-list',
  templateUrl: './zone-list.component.html',
  styleUrls: ['./zone-list.component.scss'],
  standalone: false,
})
export class ZoneListComponent implements OnInit {

  zones: any = [];

  constructor(
    private route: ActivatedRoute,
    private zoneService: AuditZoneService,
    private toastService: ToastService,
  ) {
  }

  ngOnInit(): void {
    this.route.params.pipe(
      switchMap(({ aid }) => this.zoneService.getAllAuditZone(aid)),
    ).subscribe((zones: any) => {
      this.zones = zones.data;
    });
  }

  create(): void {
    const name = prompt('New Zone Name');
    if (!name) {
      return;
    }

    this.route.params.pipe(
      switchMap(({ aid }) => this.zoneService.createAuditZone({ auditId: aid, zoneName: name }, aid)),
    ).subscribe((res: any) => {
      this.zones.push(res.data);
      this.toastService.success('Create Zone', 'Successfully created new zone.');
    });
  }

  rename(zone: any) {
    const name = prompt('Rename Zone ', zone.zoneName);
    if (!name) {
      return;
    }
    let zoneData = { ...zone, zoneName: name };

    this.route.params.pipe(
      switchMap(({ aid, zid }) => this.zoneService.updateAuditZone(zoneData, zone.zoneId)),
    ).subscribe((res: any) => {
      let index = this.zones.indexOf(zone);
      this.zones[index] = zoneData;
      this.toastService.success('Rename Zone', 'Successfully renamed zone.');
    });
  }

  delete(zone: any) {
    if (!confirm(`Are you sure you want to delete '${zone.zoneName}'?`)) {
      return;
    }
    this.route.params.pipe(
      switchMap(({ aid }) => this.zoneService.deleteAuditZone(zone.zoneId)),
    ).subscribe((res: any) => {
      let index = this.zones.findIndex((a: any) => a.zoneId === zone.zoneId);
      this.zones.splice(index, 1);
      this.toastService.warn('Delete Zone', 'Successfully deleted zone.');
    });
  }

  duplicate(zone: Zone) {
    const count = prompt('How many duplicates?', '1');
    if (!count || isNaN(+count)) {
      return;
    }
    this.zoneService.duplicateAuditZone(zone.zoneId, +count).subscribe(response => {
      this.zones.push(...response.data);
      this.toastService.success('Duplicate Zone', 'Successfully duplicated zone.');
    });
  }
}
