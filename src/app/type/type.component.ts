import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {switchMap} from 'rxjs/operators';
import {FeatureService} from '../feature.service';
import {Schema} from '../forms/forms.interface';
import {FeatureData} from '../model/feature.interface';

@Component({
  selector: 'app-type',
  templateUrl: './type.component.html',
  styleUrls: ['./type.component.scss'],
})
export class TypeComponent implements OnInit {
  data?: FeatureData;
  schema?: Schema;

  constructor(
    private featureService: FeatureService,
    private route: ActivatedRoute,
  ) {
  }

  ngOnInit(): void {
    this.route.params.pipe(
      switchMap(({aid, zid, tid}) => this.featureService.findAll({
        auditId: aid,
        zoneId: zid,
        typeId: tid,
      })),
    ).subscribe(features => {
      const feature = features[0];
      this.schema = feature ? this.featureService.feature2Schema(feature) : undefined;
      this.data = feature ? this.featureService.feature2Data(feature) : {};
    });
  }
}
