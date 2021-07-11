import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {switchMap} from 'rxjs/operators';
import {Schema} from '../forms/forms.interface';
import {ParseService} from '../parse/parse.service';

@Component({
  selector: 'app-type',
  templateUrl: './type.component.html',
  styleUrls: ['./type.component.scss'],
})
export class TypeComponent implements OnInit {
  data?: object;
  schema?: Schema;

  constructor(
    private parseService: ParseService,
    private route: ActivatedRoute,
  ) {
  }

  ngOnInit(): void {
    this.route.params.pipe(
      switchMap(({aid, zid, tid}) => this.parseService.getFeatures({
        auditId: aid,
        zoneId: zid,
        typeId: tid,
      })),
    ).subscribe(features => {
      const feature = features[0];
      this.schema = feature ? this.parseService.feature2Schema(feature) : undefined;
      this.data = feature ? this.parseService.feature2Data(feature) : {};
    });
  }
}
