import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {forkJoin} from 'rxjs';
import {switchMap} from 'rxjs/operators';
import {Audit} from '../model/audit.interface';
import {Feature} from '../model/feature.interface';
import {ParseService} from '../parse/parse.service';

@Component({
  selector: 'app-audit',
  templateUrl: './audit.component.html',
  styleUrls: ['./audit.component.scss'],
})
export class AuditComponent implements OnInit {
  selectedAudit?: Audit;
  selectedFeatures: Feature[] = [];
  data: object = {};
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
        this.parseService.getFeatures({auditId: aid, zoneId: 'null'}),
      ])),
    ).subscribe(([audits, features]) => {
      this.selectedAudit = audits[0];
      this.selectedFeatures = features;
      this.data = features[0] ? this.parseService.feature2Data(features[0]) : {};
    });
  }
}
