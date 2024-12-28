import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {switchMap} from 'rxjs';
import {AuditService} from '../../shared/services/audit.service';
import {Audit} from '../../shared/model/audit.interface';

@Component({
  selector: 'app-audit-detail',
  templateUrl: './audit-detail.component.html',
  styleUrls: ['./audit-detail.component.scss'],
  standalone: false,
})
export class AuditDetailComponent implements OnInit {
  audit?: Audit;

  constructor(
    public auditService: AuditService,
    public route: ActivatedRoute,
  ) {
  }

  ngOnInit(): void {
    this.route.params.pipe(
      switchMap(({aid}) => this.auditService.getSingleAudit(aid)),
    ).subscribe(({data}) => {
      this.audit = data;
    });

    this.route.params.pipe(
      switchMap(({aid}) => this.auditService.getPercentage({
        percentageType: 'complete',
        auditId: aid,
      })),
    ).subscribe(res => this.auditService.currentProgress = res);
  }
}
