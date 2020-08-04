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
  data: object = {};

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

      this.data = features[0] ? this.feature2Data(features[0]) : {};
    });
  }

  feature2Data(feature: Feature): object {
    const data = {};
    const formIds = feature.formId.split('\u001F');
    const values = feature.values.split('\u001F');
    const length = Math.min(formIds.length, values.length);

    for (let i = 0; i < length; i++) {
      data[formIds[i]] = values[i];
    }

    return data;
  }
}
