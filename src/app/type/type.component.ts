import {Component, OnDestroy, OnInit} from '@angular/core';
import {Audit, Type, Zone} from "../model/audit.interface";
import {Subscription} from "rxjs";
import {ParseService} from "../parse/parse.service";
import {ActivatedRoute} from "@angular/router";

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
        this.types = Object.values(this.audit.type).filter(t => t.type === this.typeName);
        this.selectedType = this.audit.type[tid];
      });
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
