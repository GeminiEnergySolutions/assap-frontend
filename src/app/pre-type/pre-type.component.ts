import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {map, switchMap, tap} from 'rxjs/operators';
import {AuditService} from '../audit.service';
import {Audit, Type, Zone} from '../model/audit.interface';

@Component({
  selector: 'app-pre-type',
  templateUrl: './pre-type.component.html',
  styleUrls: ['./pre-type.component.scss'],
})
export class PreTypeComponent implements OnInit {
  audit?: Audit;
  zone?: Zone;
  typeName?: string;
  types: Type[] = [];

  constructor(
    private route: ActivatedRoute,
    private auditService: AuditService,
  ) {
  }

  ngOnInit(): void {
    this.route.params.pipe(
      switchMap(({aid, zid, type}) => this.auditService.findAll({auditId: aid}).pipe(
        map(audits => audits[0]),
        tap(audit => {
          this.typeName = type;
          this.audit = audit;
          this.zone = audit.zone[zid];
          this.types = Object.values(audit.type).filter(t => t.type === type && t.zoneId == zid);
        }),
      )),
    ).subscribe();
  }
}
