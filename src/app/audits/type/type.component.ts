import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ToastService} from 'ng-bootstrap-ext';
import {forkJoin, Observable, of} from 'rxjs';
import {switchMap} from 'rxjs/operators';
import {FormComponent} from '../../forms/form/form.component';
import {Schema} from '../../forms/forms.interface';
import {SaveableChangesComponent} from '../../unsaved-changes.guard';
import {AuditService} from '../audit.service';
import {FeatureService} from '../feature.service';
import {Audit, Type} from '../model/audit.interface';
import {Feature, FeatureData} from '../model/feature.interface';

@Component({
  selector: 'app-type',
  templateUrl: './type.component.html',
  styleUrls: ['./type.component.scss'],
})
export class TypeComponent implements OnInit, SaveableChangesComponent {
  @ViewChild('form', {static: false}) form?: FormComponent;

  feature?: Feature;
  audit?: Audit;
  type?: Type;
  data?: FeatureData;

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
        of(tid),
        this.auditService.findOne(aid),
        this.featureService.findAll({
          belongsTo: 'type',
          auditId: aid,
          zoneId: zid,
          typeId: tid,
        }),
      ])),
    ).subscribe(([typeId, audit, features]) => {
      this.audit = audit;
      this.type = audit?.type[typeId];
      this.feature = features[0];
      this.data = this.feature ? this.featureService.feature2Data(this.feature) : {};
    });
  }

  isSaved(): boolean {
    return !this.form?.dirty;
  }

  save(schema: Schema, data: object) {
    if (!this.audit) {
      return;
    }

    let op: Observable<Feature>;
    if (this.feature) {
      const update = this.featureService.data2Feature(schema, data);
      op = this.featureService.update(this.feature, update);
    } else {
      const feature = this.featureService.data2Feature(schema, data);
      const {aid, zid, tid} = this.route.snapshot.params;
      const {ACL} = this.audit;
      op = this.featureService.create({
        auditId: aid,
        zoneId: zid,
        typeId: tid,
        belongsTo: 'type',
        mod: new Date().valueOf().toString(),
        usn: 0,
        ACL,
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
