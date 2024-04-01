import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {switchMap} from 'rxjs';
import {AuditService} from 'src/app/shared/services/audit.service';
import {EquipmentService} from 'src/app/shared/services/equipment.service';

@Component({
  selector: 'app-type-list',
  templateUrl: './type-list.component.html',
  styleUrls: ['./type-list.component.scss'],
})
export class TypeListComponent implements OnInit {
  equipment?: any;
  subtypes: any = [];

  constructor(
    private auditService: AuditService,
    protected equipmentService: EquipmentService,
    private route: ActivatedRoute,
  ) {
  }

  ngOnInit(): void {
    this.route.params.pipe(
      switchMap(({eid}) => this.equipmentService.getSingleEquipment(eid)),
    ).subscribe((res: any) => {
      this.equipment = res.data;
      this.getEquipmentPercentage(this.equipment);
    });

    this.route.params.pipe(
      switchMap(({aid, zid, eid}) => this.equipmentService.getEquipmentSubTypes(aid, zid, eid)),
    ).subscribe(res => {
      this.subtypes = res;
    });
  }

  private getEquipmentPercentage(equipment: any) {
    this.auditService.equipmentHeadingValue = equipment.equipmentName;
    this.auditService
      .getPercentage(`?percentageType=equipment&zoneId=${this.route.snapshot.params.zid}&equipmentId=${equipment.id}`)
      .subscribe(res => this.auditService.currentProgress = res);
  }

  rename(item: any) {
    const name = prompt('Rename Type', item.name);
    if (!name) {
      return;
    }

    this.equipmentService.updateEquipmentSubType({...item, name}).subscribe(res => {
      const index = this.subtypes.indexOf(item);
      this.subtypes[index] = res;
    });

  }

  delete(item: any) {
    if (!confirm(`Are you sure you want to delete '${item.name}'?`)) {
      return;
    }

    this.equipmentService.deleteEquipmentSubType(item.id).subscribe(() => {
      let index = this.subtypes.indexOf(item);
      this.subtypes.splice(index, 1);
      this.getEquipmentPercentage(this.equipment);
    });
  }

}
