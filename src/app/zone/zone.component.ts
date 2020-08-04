import {Component, OnInit} from '@angular/core';
import {Audit, Type, Zone} from "../model/audit.interface";
import {ParseService} from "../parse/parse.service";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-zone',
  templateUrl: './zone.component.html',
  styleUrls: ['./zone.component.scss']
})
export class ZoneComponent implements OnInit {
  audit?: Audit;
  zones: Zone[] = [];
  types: Type[] = [];
  selectedZone?: Zone;

  activeTab: string;

  constructor(
    private parseService: ParseService,
    private route: ActivatedRoute,
  ) {
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const aid: string = params.aid;
      const zid: number = +params.zid;
      this.parseService.getAudits({auditId: aid}).subscribe(audits => {
        this.audit = audits[0];
        this.zones = Object.values(this.audit.zone);
        this.selectZone(zid);
      });
    });
  }

  private selectZone(zoneId: number) {
    this.selectedZone = this.zones.find(a => a.id === zoneId);
    this.types = this.selectedZone?.typeId.map(tid => this.audit.type[tid]) ?? [];
  }
}
