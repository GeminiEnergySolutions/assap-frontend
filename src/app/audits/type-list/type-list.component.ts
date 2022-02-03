import {Component, Input} from '@angular/core';
import {ToastService} from 'ng-bootstrap-ext';
import {forkJoin} from 'rxjs';
import {AuditService} from '../audit.service';
import {FeatureService} from '../feature.service';
import {Audit, Type, Zone} from '../model/audit.interface';
import {ApplianceType} from '../model/types';
import {TypeService} from '../type.service';

@Component({
  selector: 'app-type-list',
  templateUrl: './type-list.component.html',
  styleUrls: ['./type-list.component.scss'],
})
export class TypeListComponent {
  @Input() audit!: Audit;
  @Input() zone!: Zone;
  @Input() types!: Type[];
  @Input() type!: ApplianceType;
  @Input() routerPrefix = '';

  constructor(
    private auditService: AuditService,
    private typeService: TypeService,
    private featureService: FeatureService,
    private toastService: ToastService,
  ) {
  }

  createType(type: ApplianceType, subType?: ApplianceType) {
    const typeOrSubType = subType?.name ?? type.name;
    const name = prompt(`New ${typeOrSubType} Name`);
    if (!name) {
      return;
    }
    this.typeService.create(this.audit, this.zone.id, {
      type: type.name,
      subtype: subType?.name ?? null,
      name,
    }).subscribe(type => {
      this.types.push(type);
    }, error => {
      this.toastService.error(typeOrSubType, `Failed to create ${typeOrSubType}`, error);
    });
  }

  rename(type: Type) {
    const name = prompt('Rename Type', type.name);
    if (!name) {
      return;
    }
    this.typeService.update(this.audit, type.id, {name}).subscribe(undefined, error => {
      this.toastService.error('Type', 'Failed to rename type', error);
    });
  }

  delete(type: Type) {
    if (!confirm(`Are you sure you want to delete '${type.name}'?`)) {
      return;
    }
    forkJoin([
      this.typeService.delete(this.audit, type.zoneId, type.id),
      this.featureService.deleteAll({typeId: type.id.toString()}),
    ]).subscribe(() => {
      const index = this.types.indexOf(type);
      if (index >= 0) {
        this.types.splice(index, 1);
      }
    }, error => {
      this.toastService.error('Type', 'Failed to delete type', error);
    });
  }
}
