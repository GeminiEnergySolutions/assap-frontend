import {Component, OnInit} from '@angular/core';
import {Audit} from "../model/audit.interface";
import {ParseService} from "../parse/parse.service";
import {Feature} from "../model/feature.interface";

@Component({
  selector: 'app-pre-audit',
  templateUrl: './pre-audit.component.html',
  styleUrls: ['./pre-audit.component.scss']
})
export class PreAuditComponent implements OnInit {
  audits: Audit[] = [];
  selectedAudit?: Audit;
  selectedFeatures: Feature[] = [];

  constructor(
    private parseService: ParseService,
  ) {
  }

  ngOnInit(): void {
    this.parseService.getAudits().subscribe(audits => {
      this.audits = audits;
    });
  }

  selectAudit(audit: Audit) {
    this.selectedAudit = audit;

    this.parseService.getFeatures({auditId: audit.auditId, zoneId: "null"}).subscribe(features => {
      this.selectedFeatures = features;
    });
  }
}
