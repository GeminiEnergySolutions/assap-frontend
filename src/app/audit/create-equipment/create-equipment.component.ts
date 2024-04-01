import {Component, OnInit} from '@angular/core';
import {switchMap} from 'rxjs';
import {EquipmentService} from '../../shared/services/equipment.service';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-create-equipment',
  templateUrl: './create-equipment.component.html',
  styleUrl: './create-equipment.component.scss',
})
export class CreateEquipmentComponent implements OnInit {
  types: any;
  typeChilds: any[] = [];

  constructor(
    private route: ActivatedRoute,
    protected equipmentService: EquipmentService,
  ) {
  }

  ngOnInit() {
    this.route.params.pipe(
      switchMap(({eid}) => this.equipmentService.getEquipmentTypesByEquipmentId(eid)),
    ).subscribe(res => {
      this.types = res.data;
      this.equipmentService.equipment = this.types[0]?.equipment;
    });
  }

  create() {
  }

  createType(type: any) {
    if (type.name == 'Fluorescent') {
      if (!this.typeChilds || !this.typeChilds.length)
        this.equipmentService.getEquipmentTypeChilds(type.id).subscribe((res: any) => {
          this.typeChilds = res.data;
        });
      return;
    }
    const displayType = type.name;
    const name = prompt(`New ${displayType} Name`);
    if (!name) {
      return;
    }

    let dataObj: any = {
      auditId: this.route.snapshot.params.aid,
      zoneId: this.route.snapshot.params.zid,
      // typeId: type.id,
      equipmentId: this.types[0].equipmentId,
      name: name,
    };
    dataObj.typeId = type.equipmentType ? type.typeId : type.id;
    dataObj.typeChildId = type.equipmentType ? type.id : null;

    this.equipmentService.createEquipmentSubType(dataObj).subscribe(() => {
    });

  }

}
