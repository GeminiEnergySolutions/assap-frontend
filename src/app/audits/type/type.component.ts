import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ToastService} from 'ng-bootstrap-ext';
import {forkJoin, Observable} from 'rxjs';
import {switchMap, tap} from 'rxjs/operators';
import {FormComponent} from '../../forms/form/form.component';
import {Schema} from '../../forms/schema';
import {SchemaService} from '../../forms/schema.service';
import {SaveableChangesComponent} from '../../unsaved-changes.guard';
import {AuditService} from '../audit.service';
import {FeatureService} from '../feature.service';
import {Audit, MinAuditKeys, Type} from '../model/audit.interface';
import {Feature, FeatureData} from '../model/feature.interface';
import {TypeService} from '../type.service';

type MyAudit = Pick<Audit, 'ACL' | MinAuditKeys>;

@Component({
  selector: 'app-type',
  templateUrl: './type.component.html',
  styleUrls: ['./type.component.scss'],
})
export class TypeComponent implements OnInit, SaveableChangesComponent {
  @ViewChild('form', {static: false}) form?: FormComponent;

  feature?: Feature;
  audit?: MyAudit;
  type?: Type;
  schema?: Schema;
  data?: FeatureData;

  constructor(
    private typeService: TypeService,
    private auditService: AuditService,
    private featureService: FeatureService,
    private toastService: ToastService,
    private schemaService: SchemaService,
    private route: ActivatedRoute,
  ) {
  }

  ngOnInit(): void {
    this.route.params.pipe(
      switchMap(({aid}) => this.auditService.findOne(aid, ['ACL'])),
    ).subscribe(audit => {
      this.audit = audit;
    });

    this.route.params.pipe(
      switchMap(({aid, zid, tid}) => forkJoin([
        this.featureService.findAll({
          belongsTo: 'type',
          auditId: aid,
          zoneId: zid,
          typeId: tid,
        }).pipe(
          tap(([f]) => this.feature = f),
        ),
        this.typeService.get(aid, +zid, +tid).pipe(
          tap(t => this.type = t),
          switchMap(({type, subtype}) => this.schemaService.loadSchema({type, subtype})),
        ),
       ])),
    ).subscribe(([[feature], schema]) => {
      this.schema = schema;
      this.data = feature && schema ? this.featureService.feature2Data(schema, feature) : {};
    });
  }

  isSaved(): boolean {
    return !this.form?.dirty;
  }

  save(data: FeatureData) {
    if (!this.audit || !this.schema) {
      return;
    }

    let op: Observable<Feature>;
    if (this.feature) {
      const update = this.featureService.data2Feature(this.schema, data);
      op = this.featureService.update(this.feature, update);
    } else {
      const feature = this.featureService.data2Feature(this.schema, data);
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
