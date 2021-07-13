import {Component, OnInit} from '@angular/core';
import {v4 as UUID} from 'uuid';
import {Audit} from '../model/audit.interface';
import {ParseService} from '../parse/parse.service';

@Component({
  selector: 'app-pre-audit',
  templateUrl: './pre-audit.component.html',
  styleUrls: ['./pre-audit.component.scss'],
})
export class PreAuditComponent implements OnInit {
  audits: Audit[] = [];

  constructor(
    private parseService: ParseService,
  ) {
  }

  ngOnInit(): void {
    this.parseService.getAudits().subscribe(audits => {
      this.audits = audits;
    });
  }

  create(): void {
    const name = prompt('New Audit Name');
    this.parseService.createAudit({
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
}
