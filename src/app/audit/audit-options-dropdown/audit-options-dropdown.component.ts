import {DatePipe, TitleCasePipe} from '@angular/common';
import {Component, EventEmitter, inject, Input, Output} from '@angular/core';
import {ToastService} from '@mean-stream/ngbx';
import {
  NgbDropdown,
  NgbDropdownButtonItem,
  NgbDropdownItem,
  NgbDropdownMenu,
  NgbDropdownToggle,
  NgbTooltip,
} from '@ng-bootstrap/ng-bootstrap';
import {PromptModalService} from '../../shared/components/prompt-modal/prompt-modal.service';
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
    DatePipe,
    TitleCasePipe,
  ],
})
export class AuditOptionsDropdownComponent {
  protected authService = inject(AuthService);
  private auditService = inject(AuditService);
  private toastService = inject(ToastService);
  private promptModalService = inject(PromptModalService);

  @Input({required: true}) audit?: Audit;

  @Output() deleted = new EventEmitter<Audit>();

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

    this.promptModalService.prompt(this.promptModalService.simplePrompt(
      'Rename Audit',
      'Audit Name',
      'Rename',
    ), {
      value: this.audit.auditName,
    }).then(({value}) => {
      this.auditService.updateAudit(this.audit!.auditId, {auditName: value}).subscribe(() => {
        this.audit!.auditName = value;
        this.toastService.success('Rename Audit', 'Successfully renamed audit.');
      });
    })
  }

  delete() {
    if (!this.audit) {
      return;
    }
    this.promptModalService.prompt(this.promptModalService.confirmDanger({
      title: `Delete Audit`,
      text: `Are you sure you want to delete '${this.audit.auditName}'?`,
      dangerText: 'This action cannot be undone.',
      submitLabel: 'Yes, Delete',
    }, {
      type: 'text',
      expected: this.audit.auditName,
    })).then(() => {
      this.auditService.deleteAudit(this.audit!.auditId).subscribe(() => {
        this.deleted.emit(this.audit);
        this.toastService.success('Delete Audit', 'Successfully deleted audit.');
      });
    });
  }

  protected generateReport() {
    this.auditService.generateReport({
      auditId: this.audit!.auditId,
      type: 'energy_audit',
    }).subscribe({
      next: () => {
        const toast = this.toastService.success('Report Queued', 'Your report was successfully queued. It will be available shortly.');
        toast.delay = 15_000;
        toast.actions = [{name: 'View Reports', link: ['/audits', this.audit!.auditId, 'reports']}];
      },
    });
  }
}
