import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {switchMap} from 'rxjs/operators';
import {AuditService} from '../audit.service';
import {Audit, Zone} from '../model/audit.interface';

@Component({
  selector: 'app-pre-zone',
  templateUrl: './pre-zone.component.html',
  styleUrls: ['./pre-zone.component.scss'],
})
export class PreZoneComponent implements OnInit {
  audit?: Audit;
  zones: Zone[] = [];

  constructor(
    private route: ActivatedRoute,
    private auditService: AuditService,
  ) {
  }

  ngOnInit(): void {
    this.route.params.pipe(
      switchMap(({aid}) => this.auditService.findAll({auditId: aid})),
    ).subscribe(audits => {
      this.audit = audits[0];
      this.zones = Object.values(this.audit.zone);
    });
  }

  createZone() {
    const name = prompt('New Zone Name');
    if (!name) {
      return;
    }

    this.auditService.createZone(this.audit, {name}).subscribe(zone => {
      this.audit.zone[zone.id] = zone;
      this.zones.push(zone);
    });
  }
}
