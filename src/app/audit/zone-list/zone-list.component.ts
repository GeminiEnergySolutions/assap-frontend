import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastService } from 'ng-bootstrap-ext';
import { switchMap } from 'rxjs';
import { AuditZoneService } from 'src/app/shared/services/audit-zone.service';
import { AuditService } from 'src/app/shared/services/audit.service';
import { EquipmentService } from 'src/app/shared/services/equipment.service';

@Component({
  selector: 'app-zone-list',
  templateUrl: './zone-list.component.html',
  styleUrls: ['./zone-list.component.scss']
})
export class ZoneListComponent implements OnInit {

  zones: any = [];
  @Output() outPutOverFlow: EventEmitter<boolean> = new EventEmitter();

  constructor(
    private route: ActivatedRoute,
    private auditService: AuditService,
    private zoneService: AuditZoneService,
    private toastService: ToastService,
  ) {
  }

  ngOnInit(): void {
    this.route.params.pipe(
      switchMap(({ aid }) => this.zoneService.getAllAuditZone(aid)),
    ).subscribe((zones: any) => {
      this.zones = zones.data;
      if (this.zones.length * 60 > window.innerHeight - 210) {
        this.outPutOverFlow.emit(true);
      } else {
        this.outPutOverFlow.emit(false);
      }
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
      if (this.zones.length * 60 > window.innerHeight - 210) {
        this.outPutOverFlow.emit(true);
      } else {
        this.outPutOverFlow.emit(false);
      }
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
      if (this.zones.length * 60 > window.innerHeight - 210) {
        this.outPutOverFlow.emit(true);
      } else {
        this.outPutOverFlow.emit(false);
      }
    });
  }

}
