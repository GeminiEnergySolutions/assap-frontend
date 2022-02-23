import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ToastService} from 'ng-bootstrap-ext';
import {Observable} from 'rxjs';
import {switchMap} from 'rxjs/operators';
import {FormComponent} from '../../forms/form/form.component';
import {Schema} from '../../forms/forms.interface';
import {SaveableChangesComponent} from '../../unsaved-changes.guard';
import {AuditService} from '../audit.service';
import {FeatureService} from '../feature.service';
import {Audit, MinAuditKeys, Type} from '../model/audit.interface';
import {Feature, FeatureData} from '../model/feature.interface';
import {Types} from '../model/types';
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
  data?: FeatureData;
  schemaId?: string;

  constructor(
    private typeService: TypeService,
    private auditService: AuditService,
    private featureService: FeatureService,
    private toastService: ToastService,
    private route: ActivatedRoute,
  ) {
  }

  ngOnInit(): void {
    this.route.params.pipe(
      switchMap(({aid, zid, tid}) => this.typeService.get(aid, +zid, +tid)),
    ).subscribe(type => {
      this.type = type;
      this.schemaId = this.getSchemaId(type);
    });

    this.route.params.pipe(
      switchMap(({aid}) => this.auditService.findOne(aid, ['ACL'])),
    ).subscribe(audit => {
      this.audit = audit;
    });

    this.route.params.pipe(
      switchMap(({aid, zid, tid}) => this.featureService.findAll({
        belongsTo: 'type',
        auditId: aid,
        zoneId: zid,
        typeId: tid,
      })),
    ).subscribe(([feature]) => {
      this.feature = feature;
      this.data = feature ? this.featureService.feature2Data(this.feature) : {};
    });
  }

  private getSchemaId(type: Type | undefined) {
    if (!type) {
      return undefined;
    }

    const type1 = Types.find(t => t.name === type.type);
    if (!type1) {
      return undefined;
    }
    if (!type.subtype || !type1.subTypes) {
      return type1.id;
    }

    const type2 = type1.subTypes.find(t => t.name === type.subtype);
    return type2?.id;
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
