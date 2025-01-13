import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ToastService} from '@mean-stream/ngbx';
import {EMPTY, switchMap} from 'rxjs';

import {Equipment, EquipmentCategory} from '../../shared/model/equipment.interface';
import {AuditService} from '../../shared/services/audit.service';
import {EquipmentService} from '../../shared/services/equipment.service';

@Component({
  selector: 'app-equipment-list',
  templateUrl: './equipment-list.component.html',
  styleUrls: ['./equipment-list.component.scss'],
  standalone: false,
})
export class EquipmentListComponent implements OnInit {
  category?: EquipmentCategory;
  equipments: Equipment[] = [];

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
      this.category = res.data;
      this.getEquipmentPercentage(this.category);
    });

    this.route.params.pipe(
      switchMap(({zid, eid}) => this.equipmentService.getEquipments(zid, eid)),
    ).subscribe(({data}) => {
      this.equipments = data;
    });

    this.route.queryParams.pipe(
      switchMap(({new: newId}) => {
        if (!newId) {
          return EMPTY;
        }
        return this.equipmentService.getEquipment(+this.route.snapshot.params.zid, +this.route.snapshot.params.eid, newId);
      }),
    ).subscribe(({data}) => {
      const index = this.equipments.findIndex(e => e.id === data.id);
      if (index >= 0) {
        this.equipments[index] = data;
      } else {
        this.equipments.push(data);
      }
      this.router.navigate(['.'], {relativeTo: this.route, queryParams: {new: null}});
    });
  }

  private getEquipmentPercentage(category: EquipmentCategory) {
    this.auditService.getPercentage({
      progressType: 'equipment',
      auditId: this.route.snapshot.params.aid,
      zoneId: this.route.snapshot.params.zid,
      equipmentId: category.id,
    }).subscribe(res => this.auditService.currentProgress = res);
  }

  delete(item: Equipment) {
    if (!confirm(`Are you sure you want to delete '${item.name}'?`)) {
      return;
    }

    const kind = item.type?.name;
    this.equipmentService.deleteEquipment(item.zoneId, item.equipmentId, item.id).subscribe(() => {
      let index = this.equipments.indexOf(item);
      this.equipments.splice(index, 1);
      this.toastService.warn('Delete Equipment', `Successfully deleted ${kind}`);
      this.getEquipmentPercentage(this.category!);
    });
  }

  duplicate(item: Equipment) {
    const kind = item.type?.name;
    this.equipmentService.duplicateEquipment(item.zoneId, item.id).subscribe(({data}) => {
      this.equipments.push(data);
      this.toastService.success('Duplicate Equipment', `Successfully duplicated ${kind}`);
    });
  }
}
