import {Component, OnInit} from '@angular/core';
import {switchMap} from 'rxjs';
import {EquipmentService} from '../../shared/services/equipment.service';
import {ActivatedRoute, Router} from '@angular/router';
import {EquipmentType} from '../../shared/model/equipment.interface';
import {ToastService} from '@mean-stream/ngbx';

@Component({
  selector: 'app-create-equipment',
  templateUrl: './create-equipment.component.html',
  styleUrl: './create-equipment.component.scss',
  standalone: false,
})
export class CreateEquipmentComponent implements OnInit {
  types: EquipmentType[] = [];

  name = '';
  type?: EquipmentType;

  constructor(
    private route: ActivatedRoute,
    protected equipmentService: EquipmentService,
    private toastService: ToastService,
    private router: Router,
  ) {
  }

  ngOnInit() {
    this.route.params.pipe(
      switchMap(({eid}) => this.equipmentService.getEquipmentTypes(eid)),
    ).subscribe(res => {
      this.types = res.data;
      if (this.types.length === 1) {
        // pre-select the only type
        this.type = this.types[0];
      }
    });
  }

  isValid() {
    return this.name && this.type;
  }

  create() {
    if (!this.type) {
      return;
    }

    const type = this.type;
    this.equipmentService.createEquipment({
      auditId: this.route.snapshot.params.aid,
      zoneId: this.route.snapshot.params.zid,
      typeId: type.id,
      equipmentId: this.types[0].equipmentId,
      name: this.name,
    }).subscribe(({data}) => {
      this.toastService.success('Create Equipment', 'Equipment created successfully');
      this.router.navigate(['..'], {
        relativeTo: this.route,
        queryParams: {
          new: data.id,
        },
      });
    });
  }
}
