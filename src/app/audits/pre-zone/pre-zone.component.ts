import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {switchMap} from 'rxjs/operators';
import {AuditService} from '../audit.service';
import {Audit, MinAuditKeys} from '../model/audit.interface';

type MyAudit = Pick<Audit, 'name' | MinAuditKeys>;

@Component({
  selector: 'app-pre-zone',
  templateUrl: './pre-zone.component.html',
  styleUrls: ['./pre-zone.component.scss'],
})
export class PreZoneComponent implements OnInit {
  audit?: MyAudit;

  constructor(
    private route: ActivatedRoute,
    private auditService: AuditService,
  ) {
  }

  ngOnInit(): void {
    this.route.params.pipe(
      switchMap(({aid}) => this.auditService.findOne(aid, ['name'])),
    ).subscribe(audit => {
      this.audit = audit;
    });
  }
}
