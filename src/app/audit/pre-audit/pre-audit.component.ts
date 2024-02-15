import {Component, OnInit} from '@angular/core';
import {AuditService} from 'src/app/shared/services/audit.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {AuthService} from 'src/app/shared/services/auth.service';
import {AddDataCollectorModalComponent} from '../add-data-collector-modal/add-data-collector-modal.component';
import {Audit} from '../../shared/model/audit.interface';

@Component({
  selector: 'app-pre-audit',
  templateUrl: './pre-audit.component.html',
  styleUrls: ['./pre-audit.component.scss'],
})
export class PreAuditComponent implements OnInit {
  audits: Record<string, Audit[]> = {};

  constructor(
    private auditService: AuditService,
    public authService: AuthService,
    private modalService: NgbModal,
  ) {
  }

  ngOnInit(): void {
    if (this.authService.currentLoginUser?.role === 'dataCollector') {
      this.auditService.getAllDataCollectorAudit().subscribe(res => {
        this.groupAudits(res);
      });
    } else {
      this.auditService.getAllAudit().subscribe(res => {
        this.groupAudits(res.data);
      });
    }
  }

  private groupAudits(audits: Audit[]) {
    this.audits = {};
    for (const audit of audits) {
      (this.audits[audit.pre_audit_form?.data?.client_state?.toString() || ''] ??= []).push(audit);
    }
  }

  create(): void {
    const name = prompt('New Audit Name');
    if (!name) {
      return;
    }

    this.auditService.createAudit({auditName: name}).subscribe(res => {
      (this.audits[''] ??= []).push(res.data);
    });
  }

  rename(state: string, audit: Audit) {
    const name = prompt('Rename Audit', audit.auditName);
    if (!name) {
      return;
    }
    let auditData = {...audit, auditName: name};

    this.auditService.updateAudit(auditData).subscribe(() => {
      let index = this.audits[state].indexOf(audit);
      this.audits[state][index] = auditData;
    });
  }

  delete(state: string, audit: Audit) {
    if (!confirm(`Are you sure you want to delete '${audit.auditName}'?`)) {
      return;
    }
    this.auditService.deleteAudit(audit.auditId).subscribe(() => {
      let index = this.audits[state].findIndex(a => a.auditId === audit.auditId);
      this.audits[state].splice(index, 1);
      if (!this.audits[state].length) {
        delete this.audits[state];
      }
    });
  }

  openAddDataCollectorModal(audit: Audit) {
    const modalRef = this.modalService.open(AddDataCollectorModalComponent, {size: 'lg'});
    modalRef.componentInstance.audit = audit;
  }

}
