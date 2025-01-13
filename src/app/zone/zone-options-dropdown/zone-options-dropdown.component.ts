import {Component, Input} from '@angular/core';
import {ToastService} from '@mean-stream/ngbx';
import {
  NgbDropdown,
  NgbDropdownButtonItem,
  NgbDropdownItem,
  NgbDropdownMenu,
  NgbDropdownToggle,
} from '@ng-bootstrap/ng-bootstrap';

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
  ) {
  }

  rename() {
    if (!this.zone) {
      return;
    }
    const name = prompt('Rename Zone', this.zone.zoneName);
    if (!name) {
      return;
    }
    this.zoneService.updateAuditZone(this.zone.auditId, this.zone.zoneId, {
      ...this.zone,
      zoneName: name,
    }).subscribe(() => {
      this.zone!.zoneName = name;
      this.toastService.success('Rename Zone', 'Successfully renamed zone.');
    });
  }
}
