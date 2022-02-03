import {Component, OnInit} from '@angular/core';
import {ToastService} from 'ng-bootstrap-ext';
import {forkJoin} from 'rxjs';
import {FormsService} from '../../forms/forms.service';
import {AuditService} from '../audit.service';
import {FeatureService} from '../feature.service';
import {Audit} from '../model/audit.interface';
import {OfflineAuditService} from '../offline-audit.service';

@Component({
  selector: 'app-pre-audit',
  templateUrl: './pre-audit.component.html',
  styleUrls: ['./pre-audit.component.scss'],
})
export class PreAuditComponent implements OnInit {
  audits: Audit[] = [];

  constructor(
    private auditService: AuditService,
    private offlineAuditService: OfflineAuditService,
    private featureService: FeatureService,
    private formsService: FormsService,
    private toastService: ToastService,
  ) {
  }

  ngOnInit(): void {
    this.auditService.findAll().subscribe(audits => {
      this.audits = audits;
    });
  }

  create(): void {
    const name = prompt('New Audit Name');
    if (!name) {
      return;
    }

    this.auditService.create({
      name,
      type: {},
      zone: {},
    }).subscribe(audit => {
      this.audits.push(audit);
    }, error => {
      this.toastService.error('Audit', 'Failed to create audit', error);
    });
  }

  rename(audit: Audit) {
    const name = prompt('Rename Audit', audit.name);
    if (!name) {
      return;
    }
    this.auditService.update(audit, {name}, a => a.name = name).subscribe(undefined, error => {
      this.toastService.error('Audit', 'Failed to rename audit', error);
    });
  }

  delete(audit: Audit) {
    if (!confirm(`Are you sure you want to delete '${audit.name}'?`)) {
      return;
    }
    forkJoin([
      this.auditService.delete(audit),
      this.featureService.deleteAll({auditId: audit.auditId}),
    ]).subscribe(() => {
      const index1 = this.audits.indexOf(audit);
      if (index1 >= 0) {
        this.audits.splice(index1, 1);
      }
    }, error => {
      this.toastService.error('Audit', 'Failed to delete audit', error);
    });
  }

  download(audit: Audit) {
    if (audit.pendingChanges && !confirm(`Are you sure you want to discard ${audit.pendingChanges} pending changes? This cannot be undone.`)) {
      return;
    }
    this.formsService.loadSchemas().subscribe();
    this.offlineAuditService.save(audit);
    this.featureService.saveAll({auditId: audit.auditId});
  }

  upload(audit: Audit) {
    forkJoin([
      this.auditService.upload(audit),
      this.featureService.upload({auditId: audit.auditId}),
    ]).subscribe(undefined, error => {
      this.toastService.error('Audit', 'Failed to upload audit', error);
    });
  }

  deleteOffline(audit: Audit) {
    const message = 'Are you sure you want to discard the offline copy' + (
      audit.pendingChanges
        ? ', including ' + audit.pendingChanges + ' pending changes? This cannot be undone.'
        : '? This can be undone once an internet connection is available.'
    );
    if (!confirm(message)) {
      return;
    }
    this.offlineAuditService.delete(audit);
  }
}
