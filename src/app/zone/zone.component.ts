import {Component, OnDestroy, OnInit} from '@angular/core';
import {Audit, Type, Zone} from "../model/audit.interface";
import {ParseService} from "../parse/parse.service";
import {ActivatedRoute} from "@angular/router";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-zone',
  templateUrl: './zone.component.html',
  styleUrls: ['./zone.component.scss']
})
export class ZoneComponent implements OnInit, OnDestroy {
  audit?: Audit;
  zones: Zone[] = [];
  types: Type[] = [];
  groupedTypes: { [type: string]: Type[]; } = {};
  selectedZone?: Zone;

  activeTab: string;

  subscription: Subscription;

  constructor(
    private parseService: ParseService,
    private route: ActivatedRoute,
  ) {
  }

  ngOnInit(): void {
    this.subscription = this.route.params.subscribe(params => {
      const aid: string = params.aid;
      const zid: number = +params.zid;
      this.parseService.getAudits({auditId: aid}).subscribe(audits => {
        this.audit = audits[0];
        this.zones = Object.values(this.audit.zone);
        this.selectZone(zid);
      });
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private selectZone(zoneId: number) {
    this.selectedZone = this.zones.find(a => a.id === zoneId);
    this.types = this.selectedZone?.typeId.map(tid => this.audit.type[tid]) ?? [];

    this.groupedTypes = {};
    for (const type of this.types) {
      let array = this.groupedTypes[type.type];
      if (!array) {
        this.groupedTypes[type.type] = array = [];
      }
      array.push(type);
    }
  }
}
