import {Component, inject, OnInit} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {ModalModule, ToastService} from '@mean-stream/ngbx';
import {NgbTooltip} from '@ng-bootstrap/ng-bootstrap';
import {switchMap} from 'rxjs';
import {Equipment} from '../../shared/model/equipment.interface';
import {Zone} from '../../shared/model/zone.interface';
import {SearchPipe} from '../../shared/pipe/search.pipe';
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
    SearchPipe,
  ],
})
export class DuplicateEquipmentModalComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private equipmentService = inject(EquipmentService);
  private zoneService = inject(AuditZoneService);
  private toastService = inject(ToastService);

  zones: Zone[] = [];

  toDuplicate?: Equipment;
  newName = '';
  zoneSearch = '';
  selectedZones = new Set<number>;

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
    for (const zoneId of this.selectedZones) {
      this.equipmentService.duplicateEquipment(item.id, zoneId, this.newName).subscribe(({data}) => {
        const zone = this.zones.find(z => z.zoneId === zoneId);
        const toast = this.toastService.success('Duplicate Equipment', `Successfully duplicated ${kind} to zone ${zone?.zoneName ?? ''}`);
        toast.actions = [{
          name: 'Show',
          link: [`/audits/${item.auditId}/zones/${zoneId}/equipments/${item.equipmentId}/types/${data.id}`],
        }];

        if (zoneId === item.zoneId) {
          this.router.navigate(['..'], {relativeTo: this.route, queryParams: {new: data.id}});
        }
      });
    }
  }
}
