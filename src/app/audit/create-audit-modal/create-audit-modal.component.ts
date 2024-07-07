import {Component} from '@angular/core';
import {AuditService} from '../../shared/services/audit.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-create-audit-modal',
  templateUrl: './create-audit-modal.component.html',
  styleUrl: './create-audit-modal.component.scss',
})
export class CreateAuditModalComponent {
  name = '';

  constructor(
    private auditService: AuditService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
  }

  create() {
    this.auditService.createAudit({auditName: this.name}).subscribe(result => {
      this.router.navigate(['..'], {
        relativeTo: this.route,
        queryParams: {
          new: result.data.auditId,
        },
      });
    });
  }
}
