import { Component } from '@angular/core';
import {AuditService} from '../../shared/services/audit.service';

@Component({
  selector: 'app-create-audit-modal',
  templateUrl: './create-audit-modal.component.html',
  styleUrl: './create-audit-modal.component.scss'
})
export class CreateAuditModalComponent {
  name = '';

  constructor(
    private auditService: AuditService,
  ) {
  }

  create() {
    this.auditService.createAudit({auditName: this.name}).subscribe();
  }
}
