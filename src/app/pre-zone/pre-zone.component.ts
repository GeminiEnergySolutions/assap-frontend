import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {switchMap} from 'rxjs/operators';
import {Audit, Zone} from '../model/audit.interface';
import {ParseService} from '../parse/parse.service';

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
    private parseService: ParseService,
  ) {
  }

  ngOnInit(): void {
    this.route.params.pipe(
      switchMap(({aid}) => this.parseService.getAudits({auditId: aid})),
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

    this.parseService.createZone(this.audit, {name}).subscribe(zone => {
      this.audit.zone[zone.id] = zone;
      this.zones.push(zone);
    });
  }
}
