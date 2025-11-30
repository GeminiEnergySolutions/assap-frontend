import {Component, inject, OnInit} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {ModalModule, ToastService} from '@mean-stream/ngbx';
import {NgbTooltip} from '@ng-bootstrap/ng-bootstrap';
import {switchMap} from 'rxjs';
import {EquipmentType} from '../../shared/model/equipment.interface';
import {EquipmentService} from '../../shared/services/equipment.service';

@Component({
  selector: 'app-create-equipment',
  templateUrl: './create-equipment.component.html',
  styleUrl: './create-equipment.component.scss',
  imports: [
    ModalModule,
    NgbTooltip,
    FormsModule,
  ],
})
export class CreateEquipmentComponent implements OnInit {
  protected equipmentService = inject(EquipmentService);
  private route = inject(ActivatedRoute);
  private toastService = inject(ToastService);
  private router = inject(Router);

  types: EquipmentType[] = [];

  name = '';
  type?: EquipmentType;

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
