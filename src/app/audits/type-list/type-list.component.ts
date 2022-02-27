import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ToastService} from 'ng-bootstrap-ext';
import {forkJoin} from 'rxjs';
import {map, switchMap, tap} from 'rxjs/operators';
import {SchemaService} from '../../forms/schema.service';
import {AuditService} from '../audit.service';
import {FeatureService} from '../feature.service';
import {Audit, MinAuditKeys, Type} from '../model/audit.interface';
import {TypeService} from '../type.service';

type MyAudit = Pick<Audit, MinAuditKeys>;

@Component({
  selector: 'app-type-list',
  templateUrl: './type-list.component.html',
  styleUrls: ['./type-list.component.scss'],
})
export class TypeListComponent implements OnInit {
  audit?: MyAudit;
  type!: string;
  types?: Type[];

  subtypes: string[] = [];

  constructor(
    private route: ActivatedRoute,
    private auditService: AuditService,
    private typeService: TypeService,
    private featureService: FeatureService,
    private toastService: ToastService,
    private schemaService: SchemaService,
  ) {
  }

  ngOnInit() {
    this.route.params.pipe(
      tap(({type}) => this.type = type),
      switchMap(({type}) => this.schemaService.loadSchemas(type, undefined, ['subtype'])),
    ).subscribe(schemas => {
      this.subtypes = Array.from(new Set(schemas.filter(s => s.subtype).map(s => s.subtype!))).sort();
    });

    this.route.params.pipe(
      switchMap(({aid, zid, type}) => this.typeService.getAll(aid, +zid).pipe(
        map(ts => ts.filter(t => t.type === type)),
      )),
    ).subscribe(types => this.types = types);

    this.route.params.pipe(
      switchMap(({aid}) => this.auditService.findOne(aid, [])),
    ).subscribe(audit => {
      this.audit = audit;
    });
  }

  createType(type: string, subtype: string | null) {
    const displayType = subtype || type;
    const name = prompt(`New ${displayType} Name`);
    if (!name) {
      return;
    }
    this.typeService.create(this.audit!, +this.route.snapshot.params.zid, {
      type,
      subtype,
      name,
    }).subscribe(type => {
      this.types?.push(type);
    }, error => {
      this.toastService.error(subtype || type, `Failed to create ${displayType}`, error);
    });
  }

  rename(type: Type) {
    const name = prompt('Rename Type', type.name);
    if (!name) {
      return;
    }
    this.typeService.update(this.audit!, type.id, {name}).subscribe(undefined, error => {
      this.toastService.error('Type', 'Failed to rename type', error);
    });
  }

  delete(type: Type) {
    if (!confirm(`Are you sure you want to delete '${type.name}'?`)) {
      return;
    }
    forkJoin([
      this.typeService.delete(this.audit!, type.zoneId, type.id),
      this.featureService.deleteAll({typeId: type.id.toString()}),
    ]).subscribe(() => {
      if (!this.types) {
        return;
      }

      const index = this.types.indexOf(type);
      if (index >= 0) {
        this.types.splice(index, 1);
      }
    }, error => {
      this.toastService.error('Type', 'Failed to delete type', error);
    });
  }
}
