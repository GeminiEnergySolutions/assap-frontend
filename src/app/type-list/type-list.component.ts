import {Component, Input, OnInit} from '@angular/core';
import {AuditService} from '../audit.service';
import {Audit, Type, Zone} from '../model/audit.interface';
import {Types} from '../model/types';

@Component({
  selector: 'app-type-list',
  templateUrl: './type-list.component.html',
  styleUrls: ['./type-list.component.scss'],
})
export class TypeListComponent {
  @Input() audit: Audit;
  @Input() zone: Zone;
  @Input() types: Type[];
  @Input() type: (typeof Types)[number];
  @Input() routerPrefix = '';

  constructor(
    private auditService: AuditService,
  ) {
  }

  createType(type: (typeof Types)[number], subType?: (typeof Types)[number]['subTypes'][number]) {
    const name = prompt(`New ${subType?.name ?? type.name} Name`);
    if (!name) {
      return;
    }
    this.auditService.createType(this.audit, this.zone, {
      type: type.name,
      subtype: subType?.name ?? null,
      name,
    }).subscribe(type => {
      this.zone.typeId.push(type.id);
      this.audit.type[type.id] = type;
      this.types.push(type);
    });
  }

  rename(type: Type) {
    const name = prompt('Rename Type', type.name);
    if (!name) {
      return;
    }
    this.auditService.updateType(this.audit, type.id, {name}).subscribe(() => {
      type.name = name;
    });
  }
}
