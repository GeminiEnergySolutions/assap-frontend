import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ToastService} from 'ng-bootstrap-ext';
import {forkJoin, Observable} from 'rxjs';
import {switchMap} from 'rxjs/operators';
import {FormComponent} from '../../forms/form/form.component';
import {Schema} from '../../forms/schema';
import {SchemaService} from '../../forms/schema.service';
import {SaveableChangesComponent} from '../../unsaved-changes.guard';
import {ParseCredentialService} from '../../parse/parse-credential.service';
import {AuditService} from '../audit.service';
import {FeatureService} from '../feature.service';
import {Audit} from '../model/audit.interface';
import {Feature, FeatureData} from '../model/feature.interface';

@Component({
  selector: 'app-audit',
  templateUrl: './audit.component.html',
  styleUrls: ['./audit.component.scss'],
})
export class AuditComponent implements OnInit, SaveableChangesComponent {
  @ViewChild('form', {static: false}) form?: FormComponent;

  audit?: Pick<Audit, 'name' | 'auditId' | 'ACL'>;
  feature?: Feature;
  data?: FeatureData;
  schema?: Schema;
  serverUrl?: string;

  constructor(
    private parseCredentialService: ParseCredentialService,
    private auditService: AuditService,
    private featureService: FeatureService,
    private toastService: ToastService,
    private schemaService: SchemaService,
    public route: ActivatedRoute,
  ) {
  }

  ngOnInit(): void {
    this.serverUrl = this.parseCredentialService.credentials?.reportUrl;

    this.route.params.pipe(
      switchMap(({aid}) => this.auditService.findOne(aid, ['name', 'ACL'])),
    ).subscribe(audit => {
      this.audit = audit;
    });

    this.route.params.pipe(
      switchMap(({aid}) => forkJoin([
        this.featureService.findAll({auditId: aid, belongsTo: 'preaudit'}),
        this.schemaService.loadSchema({type: 'Preaudit', subtype: null}),
      ])),
    ).subscribe(([[feature], schema]) => {
      this.feature = feature;
      this.schema = schema;
      this.data = schema && feature ? this.featureService.feature2Data(schema, feature) : {};
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
      const {auditId, ACL} = this.audit;
      op = this.featureService.create({
        auditId,
        belongsTo: 'preaudit',
        mod: new Date().valueOf().toString(),
        zoneId: null,
        typeId: null,
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
