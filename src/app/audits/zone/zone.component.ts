import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {map, switchMap, tap} from 'rxjs/operators';
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

  activeTab: string;

  constructor(
    private auditService: AuditService,
    private route: ActivatedRoute,
  ) {
    for (const type of Types) {
      this.groupedTypes[type.name] = [];
    }
  }

  ngOnInit(): void {
    this.route.params.pipe(
      switchMap(({aid, zid}) => this.auditService.findAll({auditId: aid}).pipe(
        map(audits => audits[0]),
        tap(audit => this.audit = audit),
        map(audit => audit.zone[zid]),
      )),
    ).subscribe(zone => {
      this.selectedZone = zone;
      const types = this.selectedZone?.typeId.map(tid => this.audit.type[tid]) ?? [];

      for (const type of types) {
        this.groupedTypes[type.type].push(type);
      }
    });
  }
}
