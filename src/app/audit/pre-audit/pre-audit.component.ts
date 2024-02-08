import {Component, OnInit} from '@angular/core';
import {ToastService} from 'ng-bootstrap-ext';
import {forkJoin} from 'rxjs';
import {AuditService} from 'src/app/shared/services/audit.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {AuthService} from 'src/app/shared/services/auth.service';
import {AddDataCollectorModalComponent} from '../add-data-collector-modal/add-data-collector-modal.component';

@Component({
  selector: 'app-pre-audit',
  templateUrl: './pre-audit.component.html',
  styleUrls: ['./pre-audit.component.scss']
})
export class PreAuditComponent implements OnInit {

  audits: any = [];
  overFlow = false;

  constructor(private auditService: AuditService,
    public authService: AuthService,
    private toastService: ToastService,
    private modalService: NgbModal,
  ) {
  }

  ngOnInit(): void {
    let role = localStorage.getItem('role');
    if (role === 'dataCollector') {
      this.auditService.getAllDataCollectorAudit().subscribe((res: any[]) => {
        this.audits = res;
        if (this.audits.length * 60 > window.innerHeight - 210) {
          this.overFlow = true;
        }
      });
    } else {
      this.auditService.getAllAudit().subscribe((res: any) => {
        this.audits = res.data;
        if (this.audits.length * 60 > window.innerHeight - 210) {
          this.overFlow = true;
        }
      });
    }
  }

  create(): void {
    const name = prompt('New Audit Name');
    if (!name) {
      return;
    }

    this.auditService.createAudit({ auditName: name }).subscribe((res: any) => {
      this.audits.push(res.data);
      this.overFlow = this.audits.length * 60 > window.innerHeight - 210;
    });
  }

  // rename(audit: Audit) {
  rename(audit: any) {
    const name = prompt('Rename Audit', audit.auditName);
    if (!name) {
      return;
    }
    let auditData = { ...audit, auditName: name };

    this.auditService.updateAudit(auditData).subscribe((res: any) => {
      let index = this.audits.indexOf(audit);
      this.audits[index] = auditData;
    });
  }

  // delete(audit: Audit) {
  delete(audit: any) {
    if (!confirm(`Are you sure you want to delete '${audit.auditName}'?`)) {
      return;
    }
    this.auditService.deleteAudit(audit.auditId).subscribe((res: any) => {
      let index = this.audits.findIndex((a: any) => a.auditId === audit.auditId);
      this.audits.splice(index, 1);
      this.overFlow = this.audits.length * 60 > window.innerHeight - 210;
    })
  }

  // download(audit: Audit) {
  download(audit: any) {
    if (audit.pendingChanges && !confirm(`Are you sure you want to discard ${audit.pendingChanges} pending changes? This cannot be undone.`)) {
      return;
    }
    // this.schemaService.loadSchemas().subscribe();
    // this.offlineAuditService.save(audit);
    // this.featureService.saveAll({auditId: audit.auditId});
  }

  // upload(audit: Audit) {
  upload(audit: any) {
    forkJoin([
      // this.auditService.upload(audit),
      // this.featureService.upload({auditId: audit.auditId}),
    ]).subscribe(undefined, error => {
      this.toastService.error('Audit', 'Failed to upload audit', error);
    });
  }
  openAddDataCollectorModal(audit: any) {
    const modalRef = this.modalService.open(AddDataCollectorModalComponent, { size: 'lg' });
    modalRef.componentInstance.audit = audit;
  }

  // deleteOffline(audit: Audit) {
  deleteOffline(audit: any) {
    const message = 'Are you sure you want to discard the offline copy' + (
      audit.pendingChanges
        ? ', including ' + audit.pendingChanges + ' pending changes? This cannot be undone.'
        : '? This can be undone once an internet connection is available.'
    );
    if (!confirm(message)) {
      return;
    }
    // this.offlineAuditService.delete(audit);
  }

}
