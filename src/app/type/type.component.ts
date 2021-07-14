import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {forkJoin} from 'rxjs';
import {map, switchMap} from 'rxjs/operators';
import {AuditService} from '../audit.service';
import {FeatureService} from '../feature.service';
import {Schema} from '../forms/forms.interface';
import {FeatureData} from '../model/feature.interface';
import {Types} from '../model/types';

@Component({
  selector: 'app-type',
  templateUrl: './type.component.html',
  styleUrls: ['./type.component.scss'],
})
export class TypeComponent implements OnInit {
  data?: FeatureData;
  schema?: Schema;
  schemaId?: string;

  constructor(
    private auditService: AuditService,
    private featureService: FeatureService,
    private route: ActivatedRoute,
  ) {
  }

  ngOnInit(): void {
    this.route.params.pipe(
      switchMap(({aid, zid, tid}) => forkJoin([
        this.auditService.findAll({auditId: aid}).pipe(map(audits => audits[0].type[tid])),
        this.featureService.findAll({
          auditId: aid,
          zoneId: zid,
          typeId: tid,
        }),
      ])),
    ).subscribe(([type, features]) => {
      const type1 = Types.find(t => t.name === type.type);
      const type2 = type.subtype ? type1.subTypes.find(t => t.name === type.subtype) : type1;
      this.schemaId = type2.id;

      const feature = features[0];
      this.schema = feature ? this.featureService.feature2Schema(feature) : undefined;
      this.data = feature ? this.featureService.feature2Data(feature) : {};
    });
  }
}
