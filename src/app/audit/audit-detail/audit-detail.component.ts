import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {switchMap} from 'rxjs';
import {AuditService} from '../../shared/services/audit.service';
import {Audit} from '../../shared/model/audit.interface';
import {Breadcrumb, BreadcrumbService} from '../../shared/services/breadcrumb.service';

@Component({
  selector: 'app-audit-detail',
  templateUrl: './audit-detail.component.html',
  styleUrls: ['./audit-detail.component.scss'],
  standalone: false,
})
export class AuditDetailComponent implements OnInit, OnDestroy {
  audit?: Audit;

  constructor(
    public auditService: AuditService,
    private breadcrumbService: BreadcrumbService,
    public route: ActivatedRoute,
  ) {
  }

  ngOnInit(): void {
    const breadcrumb: Breadcrumb = {label: '<Audit>', routerLink: '.', relativeTo: this.route};
    this.breadcrumbService.pushBreadcrumb(breadcrumb);

    this.route.params.pipe(
      switchMap(({aid}) => this.auditService.getSingleAudit(aid)),
    ).subscribe(({data}) => {
      this.audit = data;
      breadcrumb.label = data.auditName;
    });

    this.route.params.pipe(
      switchMap(({aid}) => this.auditService.getPercentage({
        percentageType: 'complete',
        auditId: aid,
      })),
    ).subscribe(res => this.auditService.currentProgress = res);
  }

  ngOnDestroy() {
    this.breadcrumbService.popBreadcrumb();
  }
}
