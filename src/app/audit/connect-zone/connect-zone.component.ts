import {Component, OnInit} from '@angular/core';
import {ConnectedZone} from '../../shared/model/zone.interface';
import {EquipmentService} from '../../shared/services/equipment.service';
import {ToastService} from '@mean-stream/ngbx';
import {ActivatedRoute} from '@angular/router';
import {switchMap} from 'rxjs';

@Component({
  selector: 'app-connect-zone',
  templateUrl: './connect-zone.component.html',
  styleUrl: './connect-zone.component.scss',
})
export class ConnectZoneComponent implements OnInit {
  connectedZones: ConnectedZone[] = [];
  selection: Record<number, boolean> = {};

  constructor(
    private route: ActivatedRoute,
    private equipmentService: EquipmentService,
    private toastService: ToastService,
  ) {
  }

  ngOnInit() {
    this.route.params.pipe(
      switchMap(({aid, zid}) => this.equipmentService.getConnectedZones(aid, zid)),
    ).subscribe(result => {
      this.connectedZones = result.data;
    });
  }

  save() {
    const zoneIds = Object.keys(this.selection).map(i => +i);
    this.equipmentService.setConnectedZones(this.route.snapshot.params.tid, zoneIds).subscribe(result => {
      this.toastService.success('Connect Zones', `Successfully connected ${zoneIds.length} zones to HVAC unit.`);
    });
  }
}
