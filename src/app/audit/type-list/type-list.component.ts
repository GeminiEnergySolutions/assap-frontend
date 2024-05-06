import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {switchMap} from 'rxjs';
import {AuditService} from 'src/app/shared/services/audit.service';
import {EquipmentService} from 'src/app/shared/services/equipment.service';
import {Equipment, EquipmentCategory} from '../../shared/model/equipment.interface';
import {ToastService} from '@mean-stream/ngbx';

@Component({
  selector: 'app-type-list',
  templateUrl: './type-list.component.html',
  styleUrls: ['./type-list.component.scss'],
})
export class TypeListComponent implements OnInit {
  equipment?: EquipmentCategory;
  subtypes: Equipment[] = [];

  constructor(
    private auditService: AuditService,
    protected equipmentService: EquipmentService,
    private toastService: ToastService,
    public route: ActivatedRoute,
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
      switchMap(({aid, zid, eid}) => this.equipmentService.getEquipments(aid, zid, eid)),
    ).subscribe(res => {
      this.subtypes = res;
    });
  }

  private getEquipmentPercentage(equipment: any) {
    this.auditService.equipmentHeadingValue = equipment.equipmentName;
    this.auditService.getPercentage({
      percentageType: 'equipment',
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

}
