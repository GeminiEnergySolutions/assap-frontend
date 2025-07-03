import {Component, Input} from '@angular/core';
import {ToastService} from '@mean-stream/ngbx';
import {
  NgbDropdown,
  NgbDropdownButtonItem,
  NgbDropdownItem,
  NgbDropdownMenu,
  NgbDropdownToggle,
} from '@ng-bootstrap/ng-bootstrap';
import {PromptModalService} from '../../shared/components/prompt-modal/prompt-modal.service';

import {Zone} from '../../shared/model/zone.interface';
import {AuditZoneService} from '../../shared/services/audit-zone.service';

@Component({
  selector: 'app-zone-options-dropdown',
  templateUrl: './zone-options-dropdown.component.html',
  styleUrl: './zone-options-dropdown.component.scss',
  imports: [
    NgbDropdown,
    NgbDropdownButtonItem,
    NgbDropdownItem,
    NgbDropdownMenu,
    NgbDropdownToggle,
  ],
})
export class ZoneOptionsDropdownComponent {
  @Input({required: true}) zone?: Zone;

  constructor(
    private zoneService: AuditZoneService,
    private toastService: ToastService,
    private promptModalService: PromptModalService,
  ) {
  }

  rename() {
    if (!this.zone) {
      return;
    }
    this.promptModalService.prompt(this.promptModalService.simplePrompt(
      'Rename Zone',
      'Zone Name',
      'Rename',
    ), {
      value: this.zone.zoneName,
    }).then(({value}) => {
      this.zoneService.updateAuditZone(this.zone!.auditId, this.zone!.zoneId, {
        ...this.zone!,
        zoneName: value,
      }).subscribe(() => {
        this.zone!.zoneName = value;
        this.toastService.success('Rename Zone', 'Successfully renamed zone.');
      });
    });
  }
}
