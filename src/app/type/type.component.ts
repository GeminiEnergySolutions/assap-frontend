import {Component, OnDestroy, OnInit} from '@angular/core';
import {Audit, Type, Zone} from "../model/audit.interface";
import {Subscription} from "rxjs";
import {ParseService} from "../parse/parse.service";
import {ActivatedRoute} from "@angular/router";
import {Schema} from "../forms/forms.interface";

@Component({
  selector: 'app-type',
  templateUrl: './type.component.html',
  styleUrls: ['./type.component.scss']
})
export class TypeComponent implements OnInit, OnDestroy {
  audit?: Audit;
  zone?: Zone;
  typeName?: string;
  types: Type[] = [];

  selectedType?: Type;
  data?: object;
  schema?: Schema;

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
      this.typeName = params.type;
      const tid: number = +params.tid;
      this.parseService.getAudits({auditId: aid}).subscribe(audits => {
        this.audit = audits[0];
        this.zone = this.audit.zone[zid];
        this.types = Object.values(this.audit.type).filter(t => t.type === this.typeName && t.zoneId === zid);
        this.selectType(tid);
      });
    });
  }

  private selectType(tid: number) {
    this.selectedType = this.audit.type[tid];
    this.parseService.getFeatures({
      auditId: this.audit.auditId,
      zoneId: `${this.zone.id}`,
      typeId: `${tid}`,
    }).subscribe(features => {
      const feature = features[0];
      this.schema = feature ? this.parseService.feature2Schema(feature) : undefined;
      this.data = feature ? this.parseService.feature2Data(feature) : {};
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
