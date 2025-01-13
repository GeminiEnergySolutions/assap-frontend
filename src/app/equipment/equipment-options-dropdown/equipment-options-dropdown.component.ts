import {Component, EventEmitter, Input, Output} from '@angular/core';
import {RouterLink} from '@angular/router';
import {ToastService} from '@mean-stream/ngbx';
import {
  NgbDropdown,
  NgbDropdownButtonItem,
  NgbDropdownItem,
  NgbDropdownMenu,
  NgbDropdownToggle,
} from '@ng-bootstrap/ng-bootstrap';

import {Equipment} from '../../shared/model/equipment.interface';
import {EquipmentService} from '../../shared/services/equipment.service';

@Component({
  selector: 'app-equipment-options-dropdown',
  templateUrl: './equipment-options-dropdown.component.html',
  styleUrl: './equipment-options-dropdown.component.scss',
  imports: [
    NgbDropdown,
    NgbDropdownButtonItem,
    NgbDropdownItem,
    NgbDropdownMenu,
    NgbDropdownToggle,
    RouterLink,
  ],
})
export class EquipmentOptionsDropdownComponent {
  @Input({required: true}) equipment?: Equipment;

  @Output() deleted = new EventEmitter<void>();

  constructor(
    private equipmentService: EquipmentService,
    private toastService: ToastService,
  ) {
  }

  rename() {
    const equipment = this.equipment;
    if (!equipment) {
      return;
    }

    const kind = equipment.type?.name;
    const name = prompt(`Rename ${kind}`, equipment.name);
    if (!name) {
      return;
    }

    this.equipmentService.updateEquipment({...equipment, name}).subscribe(({data}) => {
      equipment.name = data.name;
      this.toastService.success(`Rename ${kind}`, `Successfully renamed ${kind}`);
    });
  }
}
