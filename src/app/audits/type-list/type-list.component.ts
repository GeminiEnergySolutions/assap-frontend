import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ToastService} from 'ng-bootstrap-ext';
import {forkJoin} from 'rxjs';
import {map, switchMap} from 'rxjs/operators';
import {AuditService} from '../audit.service';
import {FeatureService} from '../feature.service';
import {Audit, AuditIdDto, Type, Zone} from '../model/audit.interface';
import {ApplianceType, Types} from '../model/types';
import {TypeService} from '../type.service';

@Component({
  selector: 'app-type-list',
  templateUrl: './type-list.component.html',
  styleUrls: ['./type-list.component.scss'],
})
export class TypeListComponent implements OnInit {
  audit?: AuditIdDto;
  type?: ApplianceType;
  types?: Type[];

  constructor(
    private route: ActivatedRoute,
    private typeService: TypeService,
    private featureService: FeatureService,
    private toastService: ToastService,
  ) {
  }

  ngOnInit() {
    this.route.params.subscribe(({type}) => this.type = Types.find(t => t.name === type));
    this.route.params.pipe(
      switchMap(({aid, zid, type}) => this.typeService.getAll(aid, +zid).pipe(
        map(ts => ts.filter(t => t.type === type)),
      )),
    ).subscribe(types => this.types = types);
  }

  createType(type: ApplianceType, subType?: ApplianceType) {
    const typeOrSubType = subType?.name ?? type.name;
    const name = prompt(`New ${typeOrSubType} Name`);
    if (!name) {
      return;
    }
    this.typeService.create(this.audit!, +this.route.snapshot.params.zid, {
      type: type.name,
      subtype: subType?.name ?? null,
      name,
    }).subscribe(type => {
      this.types?.push(type);
    }, error => {
      this.toastService.error(typeOrSubType, `Failed to create ${typeOrSubType}`, error);
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
