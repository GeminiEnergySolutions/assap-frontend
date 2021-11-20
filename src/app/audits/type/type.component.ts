import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ToastService} from 'ng-bootstrap-ext';
import {forkJoin, Observable} from 'rxjs';
import {map, switchMap} from 'rxjs/operators';
import {FormComponent} from '../../forms/form/form.component';
import {Schema} from '../../forms/forms.interface';
import {SaveableChangesComponent} from '../../unsaved-changes.guard';
import {AuditService} from '../audit.service';
import {FeatureService} from '../feature.service';
import {Type} from '../model/audit.interface';
import {Feature, FeatureData} from '../model/feature.interface';
import {Types} from '../model/types';

@Component({
  selector: 'app-type',
  templateUrl: './type.component.html',
  styleUrls: ['./type.component.scss'],
})
export class TypeComponent implements OnInit, SaveableChangesComponent {
  @ViewChild('form', {static: false}) form?: FormComponent;

  feature?: Feature;
  type?: Type;
  data?: FeatureData;
  schemaId?: string;

  constructor(
    private auditService: AuditService,
    private featureService: FeatureService,
    private toastService: ToastService,
    private route: ActivatedRoute,
  ) {
  }

  ngOnInit(): void {
    this.route.params.pipe(
      switchMap(({aid, zid, tid}) => forkJoin([
        this.auditService.findOne(aid).pipe(map(audit => audit.type[tid])),
        this.featureService.findAll({
          auditId: aid,
          zoneId: zid,
          typeId: tid,
        }),
      ])),
    ).subscribe(([type, features]) => {
      this.type = type;

      const type1 = Types.find(t => t.name === type.type);
      const type2 = type.subtype ? type1.subTypes.find(t => t.name === type.subtype) : type1;
      this.schemaId = type2.id;

      this.feature = features[0];
      this.data = this.feature ? this.featureService.feature2Data(this.feature) : {};
    });
  }

  isSaved(): boolean {
    return !this.form?.dirty;
  }

  save(schema: Schema, data: object) {
    let op: Observable<Feature>;
    if (this.feature) {
      const update = this.featureService.data2Feature(schema, data);
      op = this.featureService.update(this.feature, update);
    } else {
      const feature = this.featureService.data2Feature(schema, data);
      const {aid, zid, tid} = this.route.snapshot.params;
      op = this.featureService.create({
        auditId: aid,
        zoneId: zid,
        typeId: tid,
        belongsTo: 'type',
        mod: new Date().valueOf().toString(),
        usn: 0,
        ...feature,
      });
    }

    op.subscribe(feature => {
      this.feature = feature;
      this.toastService.success('Form', 'Successfully saved form input');
    }, error => {
      this.toastService.error('Form', 'Failed to save form input', error);
    });
  }
}
