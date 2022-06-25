import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ToastService} from 'ng-bootstrap-ext';
import {count, EMPTY, filter, forkJoin, from, mergeMap, Observable, of} from 'rxjs';
import {catchError, switchMap, tap} from 'rxjs/operators';
import {CompanycamService} from '../../companycam/companycam.service';
import {Project} from '../../companycam/model/project';
import {FormComponent} from '../../forms/form/form.component';
import {Schema} from '../../forms/schema';
import {SchemaService} from '../../forms/schema.service';
import {SaveableChangesComponent} from '../../unsaved-changes.guard';
import {AuditService} from '../audit.service';
import {FeatureService} from '../feature.service';
import {Audit, MinAuditKeys, Type, Zone} from '../model/audit.interface';
import {Feature, FeatureData} from '../model/feature.interface';
import {TypeService} from '../type.service';
import {ZoneService} from '../zone.service';

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
  zone?: Zone;
  type?: Type;
  schema?: Schema;
  data?: FeatureData;
  project?: Project;

  capturedSince?: Date;

  constructor(
    private typeService: TypeService,
    private auditService: AuditService,
    private featureService: FeatureService,
    private toastService: ToastService,
    private schemaService: SchemaService,
    private route: ActivatedRoute,
    private companycamService: CompanycamService,
    private zoneService: ZoneService,
    public modalService: NgbModal,
  ) {
  }

  ngOnInit(): void {
    this.route.params.pipe(
      switchMap(({aid}) => this.auditService.findOne(aid, ['name', 'ACL'])),
      tap(audit => this.audit = audit),
      switchMap(audit => audit ? this.companycamService.getProjects(audit.name) : of([])),
      tap(([project]) => this.project = project),
    ).subscribe();

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
        this.zoneService.get(aid, +zid).pipe(
          tap(z => this.zone = z),
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

  startCapture() {
    this.capturedSince = new Date();
  }

  tags(): [string, string][] {
    return [
      [this.zone?.name, 'Zone'],
      [this.type?.name, 'Name'],
      [this.type?.type, 'Type'],
      [this.type?.subtype, 'Subtype'],
    ].filter((s): s is [string, string] => !!s[0]);
  }

  tag() {
    const {project, zone, type, capturedSince} = this;
    if (!project || !type || !zone || !capturedSince) {
      return;
    }

    const tags = this.tags().map(([tag]) => tag);
    forkJoin([
      this.companycamService.getPhotos(project.id),
      ...tags.map(tag => this.companycamService.createTag(tag)),
    ]).pipe(
      mergeMap(([photos]) => from(photos)),
      filter(photo => photo.captured_at * 1000 >= +capturedSince),
      mergeMap(photo => this.companycamService.addTags(photo.id, tags).pipe(
        catchError(() => EMPTY),
      )),
      count(),
    ).subscribe(count => {
      if (count > 0) {
        this.toastService.success('Tag', `Tagged ${count} new photos`);
        delete this.capturedSince;
      } else {
        this.toastService.warn('Tag', 'No new photos to be tagged');
      }
    });
  }
}
