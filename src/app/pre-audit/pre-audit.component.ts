import {Component, OnInit} from '@angular/core';
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
}
