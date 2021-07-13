import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Data} from '@angular/router';
import {forkJoin} from 'rxjs';
import {switchMap} from 'rxjs/operators';
import {Audit} from '../model/audit.interface';
import {FeatureData, Feature} from '../model/feature.interface';
import {ParseService} from '../parse/parse.service';

@Component({
  selector: 'app-audit',
  templateUrl: './audit.component.html',
  styleUrls: ['./audit.component.scss'],
})
export class AuditComponent implements OnInit {
  selectedAudit?: Audit;
  selectedFeatures: Feature[] = [];
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
      this.selectedFeatures = features;
      this.data = features[0] ? this.parseService.feature2Data(features[0]) : {};
    });
  }

  save(data: Data) {
    const feature = this.selectedFeatures[0];
    const update = this.parseService.data2Feature(feature, data);
    this.parseService.saveFeature(feature.objectId, update).subscribe();
  }
}
