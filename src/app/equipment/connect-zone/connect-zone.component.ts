import {Component, OnInit} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {ModalModule, ToastService} from '@mean-stream/ngbx';
import {switchMap} from 'rxjs';
import {ZoneWithHvacConnected} from '../../shared/model/zone.interface';
import {SearchPipe} from '../../shared/pipe/search.pipe';
import {EquipmentService} from '../../shared/services/equipment.service';

@Component({
  selector: 'app-connect-zone',
  templateUrl: './connect-zone.component.html',
  styleUrl: './connect-zone.component.scss',
  imports: [ModalModule, FormsModule, SearchPipe],
})
export class ConnectZoneComponent implements OnInit {
  connectedZones: ZoneWithHvacConnected[] = [];
  selection = new Set<number>;
  search = '';

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
      for (const zone of result.data) {
        if (zone.isConnected) {
          this.selection.add(zone.zoneId);
        }
      }
    });
  }

  save() {
    const zoneIds = [...this.selection];
    const {aid, zid, tid} = this.route.snapshot.params;
    this.equipmentService.setConnectedZones(+aid, +zid, +tid, zoneIds).subscribe(() => {
      this.toastService.success('Connect Zones', `Successfully connected ${zoneIds.length} zones to HVAC unit.`);
    });
  }
}
