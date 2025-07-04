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
import {PromptModalService} from '../../shared/components/prompt-modal/prompt-modal.service';

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
  @Input() routeWithId = false;

  @Output() deleted = new EventEmitter<void>();

  constructor(
    private equipmentService: EquipmentService,
    private toastService: ToastService,
    private promptModalService: PromptModalService,
  ) {
  }

  rename() {
    const equipment = this.equipment;
    if (!equipment) {
      return;
    }

    const kind = equipment.type?.name;
    this.promptModalService.prompt(this.promptModalService.simplePrompt(
      `Rename ${kind}`,
      `${kind} Name`,
      'Rename',
    ), {
      value: equipment.name,
    }).then(({value}) => {
      this.equipmentService.updateEquipment({...equipment, name: value}).subscribe(({data}) => {
        equipment.name = data.name;
        this.toastService.success(`Rename ${kind}`, `Successfully renamed ${kind}`);
      });
    });
  }
}
