import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {forkJoin, of} from 'rxjs';
import {switchMap} from 'rxjs/operators';
import {AuditService} from '../audit.service';
import {Audit, Type, Zone} from '../model/audit.interface';
import {Types} from '../model/types';

@Component({
  selector: 'app-zone',
  templateUrl: './zone.component.html',
  styleUrls: ['./zone.component.scss'],
})
export class ZoneComponent implements OnInit {
  audit?: Audit;
  types = Types;
  groupedTypes: { [type: string]: Type[]; } = {};
  selectedZone?: Zone;

  activeTab?: string;

  constructor(
    private auditService: AuditService,
    private route: ActivatedRoute,
  ) {
  }

  ngOnInit(): void {
    this.route.params.pipe(
      switchMap(({aid, zid}) => forkJoin([
        this.auditService.findOne(aid),
        of(zid),
      ])),
    ).subscribe(([audit, zoneId]) => {
      this.audit = audit;

      const zone = audit?.zone[zoneId];
      this.selectedZone = zone;

      const types = audit && zone ? zone.typeId.map(tid => audit.type[tid]) : [];
      for (const type of Types) {
        this.groupedTypes[type.name] = [];
      }
      for (const type of types) {
        this.groupedTypes[type.type].push(type);
      }
    });
  }
}
