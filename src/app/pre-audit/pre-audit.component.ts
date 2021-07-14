import {Component, OnInit} from '@angular/core';
import {v4 as UUID} from 'uuid';
import {AuditService} from '../audit.service';
import {Audit} from '../model/audit.interface';

@Component({
  selector: 'app-pre-audit',
  templateUrl: './pre-audit.component.html',
  styleUrls: ['./pre-audit.component.scss'],
})
export class PreAuditComponent implements OnInit {
  audits: Audit[] = [];

  constructor(
    private auditService: AuditService,
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
      auditId: UUID(),
      mod: new Date().valueOf().toString(),
      name,
      type: {},
      usn: 0,
      zone: {},
    }).subscribe(audit => {
      this.audits.push(audit);
    });
  }

  rename(audit: Audit) {
    const name = prompt('Rename Audit', audit.name);
    if (!name) {
      return;
    }
    this.auditService.update(audit.objectId, {
      name,
    }).subscribe(() => {
      audit.name = name;
    });
  }
}
