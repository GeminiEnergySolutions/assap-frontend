import {Component, OnInit} from '@angular/core';
import {NgbTooltip} from '@ng-bootstrap/ng-bootstrap';
import {SearchPipe} from '../../shared/pipe/search.pipe';
import {EquipmentService} from '../../shared/services/equipment.service';
import {ModalModule, ToastService} from '@mean-stream/ngbx';
import {ActivatedRoute} from '@angular/router';
import {switchMap} from 'rxjs';
import {ZoneWithHvacConnected} from '../../shared/model/zone.interface';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-connect-zone',
  templateUrl: './connect-zone.component.html',
  styleUrl: './connect-zone.component.scss',
  imports: [ModalModule, FormsModule, NgbTooltip, SearchPipe],
})
export class ConnectZoneComponent implements OnInit {
  connectedZones: ZoneWithHvacConnected[] = [];
  selection: Record<number, boolean> = {};
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
    });
  }

  save() {
    const zoneIds = Object.entries(this.selection).filter(([, value]) => value).map(([key]) => +key);
    const {aid, zid, tid} = this.route.snapshot.params;
    this.equipmentService.setConnectedZones(+aid, +zid, +tid, zoneIds).subscribe(() => {
      this.toastService.success('Connect Zones', `Successfully connected ${zoneIds.length} zones to HVAC unit.`);
    });
  }
}
