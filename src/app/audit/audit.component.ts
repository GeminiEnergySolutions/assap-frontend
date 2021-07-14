import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Data} from '@angular/router';
import {forkJoin} from 'rxjs';
import {switchMap} from 'rxjs/operators';
import {Audit, Zone} from '../model/audit.interface';
import {Feature, FeatureData} from '../model/feature.interface';
import {ParseService} from '../parse/parse.service';
import {v4 as UUID} from 'uuid';

@Component({
  selector: 'app-audit',
  templateUrl: './audit.component.html',
  styleUrls: ['./audit.component.scss'],
})
export class AuditComponent implements OnInit {
  selectedAudit?: Audit;
  feature?: Feature;
  data: FeatureData = {};
  activeTab: 'preaudit' | 'zone' = 'preaudit';

  constructor(
    private parseService: ParseService,
    private route: ActivatedRoute,
  ) {
  }

  ngOnInit(): void {
    this.route.params.pipe(
      switchMap(({aid}) => forkJoin([
        this.parseService.getAudits({auditId: aid}),
        this.parseService.getFeatures({auditId: aid, belongsTo: 'preaudit'}),
      ])),
    ).subscribe(([audits, features]) => {
      this.selectedAudit = audits[0];
      this.feature = features[0];
      this.data = features[0] ? this.parseService.feature2Data(features[0]) : {};
    });
  }

  save(data: Data) {
    if (this.feature) {
      const update = this.parseService.data2Feature(data);
      this.parseService.updateFeature(this.feature.objectId, update).subscribe();
      return;
    }

    const {formId, values} = this.parseService.data2Feature(data);
    this.parseService.createFeature({
      auditId: this.selectedAudit.auditId,
      belongsTo: 'preaudit',
      mod: new Date().valueOf().toString(),
      zoneId: null,
      typeId: null,
      usn: 0,
      formId,
      values,
    }).subscribe(feature => {
      this.feature = feature;
    });
  }

  createZone() {
    const name = prompt('New Zone Name');
    if (!name) {
      return;
    }

    this.parseService.createZone(this.selectedAudit, {name}).subscribe(zone => {
      this.selectedAudit.zone[zone.id] = zone;
    });
  }
}
