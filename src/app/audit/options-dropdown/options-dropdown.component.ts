import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Audit} from '../../shared/model/audit.interface';
import {AuditService} from '../../shared/services/audit.service';
import {ToastService} from '@mean-stream/ngbx';
import {AuthService} from '../../shared/services/auth.service';
import {
  NgbDropdown,
  NgbDropdownButtonItem,
  NgbDropdownItem,
  NgbDropdownMenu,
  NgbDropdownToggle,
  NgbModal,
  NgbTooltip,
} from '@ng-bootstrap/ng-bootstrap';
import {AddDataCollectorModalComponent} from '../add-data-collector-modal/add-data-collector-modal.component';
import {environment} from '../../../environments/environment';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-audit-options-dropdown',
  templateUrl: './options-dropdown.component.html',
  styleUrl: './options-dropdown.component.scss',
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
export class OptionsDropdownComponent {
  @Input({required: true}) audit?: Audit;

  @Output() deleted = new EventEmitter<Audit>();

  serverUrl = environment.url;
  authToken = this.authService.getAuthToken() ?? '';

  constructor(
    private auditService: AuditService,
    private toastService: ToastService,
    protected authService: AuthService,
    private modalService: NgbModal,
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

  openAddDataCollectorModal() {
    const modalRef = this.modalService.open(AddDataCollectorModalComponent, {size: 'lg'});
    modalRef.componentInstance.audit = this.audit;
  }
}
