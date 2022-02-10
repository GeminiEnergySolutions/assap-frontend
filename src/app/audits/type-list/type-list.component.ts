import {Component, Input, OnInit} from '@angular/core';
import {ToastService} from 'ng-bootstrap-ext';
import {forkJoin} from 'rxjs';
import {Schema} from '../../forms/forms.interface';
import {FormsService} from '../../forms/forms.service';
import {AuditService} from '../audit.service';
import {FeatureService} from '../feature.service';
import {Audit, Type, Zone} from '../model/audit.interface';
import {TypeService} from '../type.service';

@Component({
  selector: 'app-type-list',
  templateUrl: './type-list.component.html',
  styleUrls: ['./type-list.component.scss'],
})
export class TypeListComponent implements OnInit {
  @Input() audit!: Audit;
  @Input() zone!: Zone;
  @Input() types!: Type[];
  @Input() type!: string;
  @Input() routerPrefix = '';

  subtypes: string[] = [];

  constructor(
    private auditService: AuditService,
    private typeService: TypeService,
    private featureService: FeatureService,
    private toastService: ToastService,
    private formsService: FormsService,
  ) {
  }

  ngOnInit() {
    this.formsService.loadSchemas(this.type).subscribe(schemas => {
      this.subtypes = Array.from(new Set(schemas.filter(s => s.subtype).map(s => s.subtype!))).sort();
    });
  }

  createType(type: string, subtype: string | null) {
    const name = prompt(`New ${subtype || type} Name`);
    if (!name) {
      return;
    }
    this.typeService.create(this.audit, this.zone, {
      type,
      subtype,
      name,
    }).subscribe(type => {
      this.types.push(type);
    }, error => {
      this.toastService.error(subtype || type, `Failed to create ${subtype || type}`, error);
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
