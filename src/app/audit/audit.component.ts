import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Data} from '@angular/router';
import {forkJoin} from 'rxjs';
import {switchMap} from 'rxjs/operators';
import {AuditService} from '../audit.service';
import {FeatureService} from '../feature.service';
import {Audit} from '../model/audit.interface';
import {Feature, FeatureData} from '../model/feature.interface';

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
    private auditService: AuditService,
    private featureService: FeatureService,
    private route: ActivatedRoute,
  ) {
  }

  ngOnInit(): void {
    this.route.params.pipe(
      switchMap(({aid}) => forkJoin([
        this.auditService.findAll({auditId: aid}),
        this.featureService.findAll({auditId: aid, belongsTo: 'preaudit'}),
      ])),
    ).subscribe(([audits, features]) => {
      this.selectedAudit = audits[0];
      this.feature = features[0];
      this.data = features[0] ? this.featureService.feature2Data(features[0]) : {};
    });
  }

  save(data: Data) {
    if (this.feature) {
      const update = this.featureService.data2Feature(data);
      this.featureService.update(this.feature.objectId, update).subscribe();
      return;
    }

    const {formId, values} = this.featureService.data2Feature(data);
    this.featureService.create({
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

    this.auditService.createZone(this.selectedAudit, {name}).subscribe(zone => {
      this.selectedAudit.zone[zone.id] = zone;
    });
  }
}
