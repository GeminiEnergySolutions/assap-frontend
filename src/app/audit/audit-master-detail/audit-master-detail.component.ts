import {Component, OnInit} from '@angular/core';
import {AuditService} from 'src/app/shared/services/audit.service';
import {AuthService} from 'src/app/shared/services/auth.service';
import {Audit} from '../../shared/model/audit.interface';
import {EMPTY, switchMap} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {BreadcrumbService} from '../../shared/services/breadcrumb.service';

@Component({
  selector: 'app-audit-master-detail',
  templateUrl: './audit-master-detail.component.html',
  styleUrls: ['./audit-master-detail.component.scss'],
  standalone: false,
})
export class AuditMasterDetailComponent implements OnInit {
  audits: Record<string, Audit[]> = {};

  constructor(
    private auditService: AuditService,
    public authService: AuthService,
    private route: ActivatedRoute,
    private breadcrumbService: BreadcrumbService,
    private router: Router,
  ) {
  }

  ngOnInit(): void {
    this.breadcrumbService.setBreadcrumbs([
      {label: 'Audits', routerLink: '.', relativeTo: this.route},
    ]);

    if (this.authService.currentLoginUser?.role?.role === 'dataCollector') {
      this.auditService.getAllDataCollectorAudit().subscribe(res => {
        this.groupAudits(res.data);
      });
    } else {
      this.auditService.getAllAudit().subscribe(res => {
        this.groupAudits(res.data);
      });
    }

    this.route.queryParams.pipe(
      switchMap(({new: newId}) => newId ? this.auditService.getSingleAudit(newId) : EMPTY),
    ).subscribe(response => {
      this.addAudit(response.data);
      this.router.navigate(['.'], {
        relativeTo: this.route,
        queryParams: {new: null},
        replaceUrl: true,
      });
    });
  }

  private groupAudits(audits: Audit[]) {
    this.audits = {};
    for (const audit of audits) {
      this.addAudit(audit);
    }
  }

  private addAudit(audit: Audit) {
    (this.audits[audit.pre_audit_form?.data?.client_state?.toString() || ''] ??= []).push(audit);
  }

  delete(state: string, audit: Audit) {
    let index = this.audits[state].findIndex(a => a.auditId === audit.auditId);
    this.audits[state].splice(index, 1);
    if (!this.audits[state].length) {
      delete this.audits[state];
    }
  }
}
