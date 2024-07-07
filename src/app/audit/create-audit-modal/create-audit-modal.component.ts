import {Component} from '@angular/core';
import {AuditService} from '../../shared/services/audit.service';
import {ActivatedRoute, Router} from '@angular/router';
import {switchMap} from 'rxjs';

@Component({
  selector: 'app-create-audit-modal',
  templateUrl: './create-audit-modal.component.html',
  styleUrl: './create-audit-modal.component.scss',
})
export class CreateAuditModalComponent {
  name = '';
  state = '';

  constructor(
    private auditService: AuditService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
  }

  create() {
    this.auditService.createAudit({auditName: this.name}).pipe(
      switchMap(result => this.auditService.updatePreAuditData(result.data.auditId, {
        auditId: result.data.auditId,
        id: result.data.pre_audit_form.id,
        data: {
          client_state: this.state,
        },
      })),
    ).subscribe(result => {
      this.router.navigate(['..'], {
        relativeTo: this.route,
        queryParams: {
          new: result.data.auditId,
        },
      });
    });
  }
}
