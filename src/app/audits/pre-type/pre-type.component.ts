import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {switchMap} from 'rxjs/operators';
import {AuditService} from '../audit.service';
import {Audit, Zone} from '../model/audit.interface';
import {ZoneService} from '../zone.service';

@Component({
  selector: 'app-pre-type',
  templateUrl: './pre-type.component.html',
  styleUrls: ['./pre-type.component.scss'],
})
export class PreTypeComponent implements OnInit {
  audit?: Pick<Audit, 'name'>;
  zone?: Zone;
  type?: string;

  constructor(
    private route: ActivatedRoute,
    private auditService: AuditService,
    private zoneService: ZoneService,
  ) {
  }

  ngOnInit(): void {
    this.route.params.subscribe(({type}) => {
      this.type = type;
    });

    this.route.params.pipe(
      switchMap(({aid}) => this.auditService.findOne(aid, ['name'])),
    ).subscribe(audit => {
      this.audit = audit;
    });

    this.route.params.pipe(
      switchMap(({aid, zid}) => this.zoneService.get(aid, +zid)),
    ).subscribe(zone => {
      this.zone = zone;
    });
  }
}
