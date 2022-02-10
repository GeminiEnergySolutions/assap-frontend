import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {forkJoin, of} from 'rxjs';
import {switchMap} from 'rxjs/operators';
import {FormsService} from '../../forms/forms.service';
import {AuditService} from '../audit.service';
import {Audit, Type, Zone} from '../model/audit.interface';

@Component({
  selector: 'app-zone',
  templateUrl: './zone.component.html',
  styleUrls: ['./zone.component.scss'],
})
export class ZoneComponent implements OnInit {
  types: string[] = [];

  audit?: Audit;
  groupedTypes: { [type: string]: Type[]; } = {};
  selectedZone?: Zone;

  activeTab?: string;

  constructor(
    private auditService: AuditService,
    private formsService: FormsService,
    private route: ActivatedRoute,
  ) {
  }

  ngOnInit(): void {
    this.route.params.pipe(
      switchMap(({aid, zid}) => forkJoin([
        this.auditService.findOne(aid),
        this.formsService.loadSchemas(undefined, undefined, ['type']),
        of(zid),
      ])),
    ).subscribe(([audit, schemas, zoneId]) => {
      this.audit = audit;

      const zone = audit?.zone[zoneId];
      this.selectedZone = zone;

      const types = audit && zone ? zone.typeId.map(tid => audit.type[tid]) : [];

      this.types = Array.from(new Set<string>(schemas.map(s => s.type).filter(s => s !== 'Preaudit'))).sort();
      for (const type of this.types) {
        this.groupedTypes[type] = [];
      }
      for (const type of types) {
        this.groupedTypes[type.type].push(type);
      }
    });
  }
}
