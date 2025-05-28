import {Component, OnInit} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {ModalModule, ToastService} from '@mean-stream/ngbx';
import {NgbTooltip} from '@ng-bootstrap/ng-bootstrap';
import {switchMap} from 'rxjs';
import {Equipment} from '../../shared/model/equipment.interface';
import {Zone} from '../../shared/model/zone.interface';
import {AuditZoneService} from '../../shared/services/audit-zone.service';
import {EquipmentService} from '../../shared/services/equipment.service';

@Component({
  selector: 'app-duplicate-equipment-modal',
  templateUrl: './duplicate-equipment-modal.component.html',
  styleUrl: './duplicate-equipment-modal.component.scss',
  imports: [
    ModalModule,
    NgbTooltip,
    ReactiveFormsModule,
    FormsModule,
  ],
})
export class DuplicateEquipmentModalComponent implements OnInit {
  zones: Zone[] = [];

  toDuplicate?: Equipment;
  newName = '';
  zone?: Zone;

  constructor(
    private route: ActivatedRoute,
    private equipmentService: EquipmentService,
    private zoneService: AuditZoneService,
    private toastService: ToastService,
  ) {
  }

  ngOnInit() {
    this.route.params.pipe(
      switchMap(({aid}) => this.zoneService.getAllAuditZone(aid)),
    ).subscribe(res => {
      this.zones = res.data;
    });

    this.route.params.pipe(
      switchMap(({zid, eid, tid}) => this.equipmentService.getEquipment(zid, eid, tid)),
    ).subscribe(res => {
      this.toDuplicate = res.data;
    });
  }

  duplicate() {
    const item = this.toDuplicate;
    if (!item) {
      return;
    }

    const kind = item.type?.name;
    const zoneId = this.zone?.zoneId ?? item.zoneId;
    this.equipmentService.duplicateEquipment(item.id, zoneId, this.newName).subscribe(({data}) => {
      const toast = this.toastService.success('Duplicate Equipment', `Successfully duplicated ${kind}`);
      if (zoneId === item.zoneId) {
        toast.actions = [{
          name: 'Show',
          link: [`/audits/${item.auditId}/zones/${zoneId}/equipments/${item.equipmentId}/types/${data.id}`],
        }];
      }
    });
  }
}
