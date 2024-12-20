import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {EMPTY, switchMap} from 'rxjs';
import {AuditService} from 'src/app/shared/services/audit.service';
import {EquipmentService} from 'src/app/shared/services/equipment.service';
import {Equipment, EquipmentCategory} from '../../shared/model/equipment.interface';
import {ToastService} from '@mean-stream/ngbx';

@Component({
  selector: 'app-equipment-list',
  templateUrl: './equipment-list.component.html',
  styleUrls: ['./equipment-list.component.scss'],
})
export class EquipmentListComponent implements OnInit {
  equipment?: EquipmentCategory;
  subtypes: Equipment[] = [];

  constructor(
    private auditService: AuditService,
    protected equipmentService: EquipmentService,
    private toastService: ToastService,
    public route: ActivatedRoute,
    private router: Router,
  ) {
  }

  ngOnInit(): void {
    this.route.params.pipe(
      switchMap(({eid}) => this.equipmentService.getEquipmentCategory(eid)),
    ).subscribe(res => {
      this.equipment = res.data;
      this.getEquipmentPercentage(this.equipment);
    });

    this.route.params.pipe(
      switchMap(({zid, eid}) => this.equipmentService.getEquipments(zid, eid)),
    ).subscribe(res => {
      this.subtypes = res;
    });

    this.route.queryParams.pipe(
      switchMap(({new: newId}) => newId ? this.equipmentService.getEquipment(newId) : EMPTY),
    ).subscribe(newEquipment => {
      const index = this.subtypes.findIndex(e => e.id === newEquipment.id);
      if (index >= 0) {
        this.subtypes[index] = newEquipment;
      } else {
        this.subtypes.push(newEquipment);
      }
      this.router.navigate(['.'], {relativeTo: this.route, queryParams: {new: null}});
    });
  }

  private getEquipmentPercentage(equipment: any) {
    this.auditService.equipmentHeadingValue = equipment.equipmentName;
    this.auditService.getPercentage({
      percentageType: 'equipment',
      auditId: this.route.snapshot.params.aid,
      zoneId: this.route.snapshot.params.zid,
      equipmentId: equipment.id,
    }).subscribe(res => this.auditService.currentProgress = res);
  }

  rename(item: any) {
    const kind = item.typeChild?.name ?? item.type?.name;
    const name = prompt(`Rename ${kind}`, item.name);
    if (!name) {
      return;
    }

    this.equipmentService.updateEquipment({...item, name}).subscribe(res => {
      const index = this.subtypes.indexOf(item);
      this.subtypes[index] = res;
      this.toastService.success(`Rename ${kind}`, `Successfully renamed ${kind}`);
    });
  }

  delete(item: any) {
    if (!confirm(`Are you sure you want to delete '${item.name}'?`)) {
      return;
    }

    this.equipmentService.deleteEquipment(item.id).subscribe(() => {
      let index = this.subtypes.indexOf(item);
      this.subtypes.splice(index, 1);
      this.getEquipmentPercentage(this.equipment);
    });
  }

  duplicate(item: Equipment) {
    this.equipmentService.duplicateEquipment(item.zoneId, item.id).subscribe(response => {
      this.subtypes.push(response);
    });
  }
}
