import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {forkJoin, of} from 'rxjs';
import {switchMap} from 'rxjs/operators';
import {AuditService} from '../audit.service';
import {Audit, Type, Zone} from '../model/audit.interface';
import {ApplianceType, Types} from '../model/types';

@Component({
  selector: 'app-pre-type',
  templateUrl: './pre-type.component.html',
  styleUrls: ['./pre-type.component.scss'],
})
export class PreTypeComponent implements OnInit {
  audit?: Audit;
  zone?: Zone;
  type?: ApplianceType;
  types: Type[] = [];

  constructor(
    private route: ActivatedRoute,
    private auditService: AuditService,
  ) {
  }

  ngOnInit(): void {
    this.route.params.pipe(
      switchMap(({aid, zid, type}) => forkJoin([
        this.auditService.findOne(aid),
        of(zid),
        of(type),
      ])),
    ).subscribe(([audit, zoneId, typeId]) => {
      this.type = Types.find(t => t.name === typeId);
      this.audit = audit;
      this.zone = audit?.zone[zoneId];
      this.types = audit ? Object.values(audit.type).filter(t => t.type === typeId && t.zoneId == zoneId) : [];
    });
  }
}
