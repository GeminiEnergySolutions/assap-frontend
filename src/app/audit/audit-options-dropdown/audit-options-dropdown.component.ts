import {Component, EventEmitter, Input, Output} from '@angular/core';
import {RouterLink} from '@angular/router';
import {ToastService} from '@mean-stream/ngbx';
import {
  NgbDropdown,
  NgbDropdownButtonItem,
  NgbDropdownItem,
  NgbDropdownMenu,
  NgbDropdownToggle,
  NgbTooltip,
} from '@ng-bootstrap/ng-bootstrap';

import {environment} from '../../../environments/environment';
import {Audit} from '../../shared/model/audit.interface';
import {AuditService} from '../../shared/services/audit.service';
import {AuthService} from '../../shared/services/auth.service';

@Component({
  selector: 'app-audit-options-dropdown',
  templateUrl: './audit-options-dropdown.component.html',
  styleUrl: './audit-options-dropdown.component.scss',
  imports: [
    NgbDropdown,
    NgbDropdownToggle,
    NgbDropdownMenu,
    NgbTooltip,
    NgbDropdownItem,
    NgbDropdownButtonItem,
    RouterLink,
  ],
})
export class AuditOptionsDropdownComponent {
  @Input({required: true}) audit?: Audit;

  @Output() deleted = new EventEmitter<Audit>();

  serverUrl = environment.url;
  authToken = this.authService.getAuthToken() ?? '';

  constructor(
    private auditService: AuditService,
    private toastService: ToastService,
    protected authService: AuthService,
  ) {
  }

  setSection(section: 'cehStatus' | 'grantStatus', status: boolean) {
    if (!this.audit) {
      return;
    }
    this.auditService.updateAudit(this.audit.auditId, {
      auditName: this.audit.auditName,
      [section]: status,
    }).subscribe(() => {
      this.audit![section] = status;
      this.toastService.success('Update Audit', `Successfully updated Feasibility Study sections.`);
    });
  }

  rename() {
    if (!this.audit) {
      return;
    }

    const name = prompt('Rename Audit', this.audit.auditName);
    if (!name) {
      return;
    }
    this.auditService.updateAudit(this.audit.auditId, {auditName: name}).subscribe(() => {
      this.audit!.auditName = name;
      this.toastService.success('Rename Audit', 'Successfully renamed audit.');
    });
  }

  delete() {
    if (!this.audit || !confirm(`Are you sure you want to delete '${this.audit.auditName}'?`)) {
      return;
    }
    this.auditService.deleteAudit(this.audit.auditId).subscribe(() => {
      this.deleted.emit(this.audit);
      this.toastService.success('Delete Audit', 'Successfully deleted audit.');
    });
  }
}
