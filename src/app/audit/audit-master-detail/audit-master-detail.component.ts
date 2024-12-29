import {Component, OnInit} from '@angular/core';
import {AuditService} from 'src/app/shared/services/audit.service';
import {AuthService} from 'src/app/shared/services/auth.service';
import {Audit} from '../../shared/model/audit.interface';
import {EMPTY, switchMap} from 'rxjs';
import {ActivatedRoute, Router, RouterLink, RouterLinkActive} from '@angular/router';
import {MasterDetailComponent} from '../../shared/components/master-detail/master-detail.component';
import {
  NgbAccordionBody,
  NgbAccordionButton,
  NgbAccordionCollapse,
  NgbAccordionDirective,
  NgbAccordionHeader,
  NgbAccordionItem,
} from '@ng-bootstrap/ng-bootstrap';
import {OptionsDropdownComponent} from '../options-dropdown/options-dropdown.component';
import {KeyValuePipe, TitleCasePipe} from '@angular/common';

@Component({
  selector: 'app-audit-master-detail',
  templateUrl: './audit-master-detail.component.html',
  styleUrls: ['./audit-master-detail.component.scss'],
  imports: [
    MasterDetailComponent,
    RouterLink,
    NgbAccordionDirective,
    NgbAccordionItem,
    NgbAccordionHeader,
    NgbAccordionButton,
    NgbAccordionCollapse,
    NgbAccordionBody,
    RouterLinkActive,
    OptionsDropdownComponent,
    TitleCasePipe,
    KeyValuePipe,
  ],
})
export class AuditMasterDetailComponent implements OnInit {
  audits: Record<string, Audit[]> = {};

  constructor(
    private auditService: AuditService,
    public authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
  ) {
  }

  ngOnInit(): void {
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
