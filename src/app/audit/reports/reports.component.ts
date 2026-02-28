import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {NgbPagination} from '@ng-bootstrap/ng-bootstrap';
import {combineLatest, switchMap} from 'rxjs';
import {icons} from '../../shared/icons';
import {FilterReportsDto, Report} from '../../shared/model/report.interface';
import {AuditService} from '../../shared/services/audit.service';
import {Breadcrumb, BreadcrumbService} from '../../shared/services/breadcrumb.service';

@Component({
  selector: 'app-reports',
  imports: [
    NgbPagination,
  ],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.scss',
})
export class ReportsComponent implements OnInit, OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly breadcrumbService = inject(BreadcrumbService);
  private readonly auditService = inject(AuditService);

  protected reports: Report[] = [];
  protected totalReports = 0;

  protected query: Required<FilterReportsDto> = {
    auditId: 0,
    type: 'energy_audit',
    size: 20,
    pageNo: 1,
  };

  ngOnInit() {
    const breadcrumb: Breadcrumb = {label: '', class: icons.audit, routerLink: '..', relativeTo: this.route};
    this.breadcrumbService.pushBreadcrumb(breadcrumb);
    this.breadcrumbService.pushBreadcrumb({
      label: 'Reports', class: icons.report, routerLink: '.', relativeTo: this.route,
    });

    this.route.params.pipe(
      switchMap(({aid}) => this.auditService.getSingleAudit(aid)),
    ).subscribe(({data}) => {
      breadcrumb.label = data.auditName;
    });

    combineLatest([this.route.params, this.route.queryParams]).pipe(
      switchMap(([params, query]) => {
        this.query.auditId = +params.aid;
        if (query.type) {
          this.query.type = query.type;
        }
        if (query.pageNo) {
          this.query.pageNo = +query.pageNo;
        }
        if (query.size) {
          this.query.size = +query.size;
        }
        return this.auditService.getReports(this.query);
      }),
    ).subscribe(({data}) => {
      this.reports = data.reports;
      this.totalReports = data.count_total_reports;
    });
  }

  ngOnDestroy() {
    this.breadcrumbService.popBreadcrumb();
    this.breadcrumbService.popBreadcrumb();
  }

  updateQuery(update: Partial<FilterReportsDto>) {
    Object.assign(this.query, update);
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: this.query,
      queryParamsHandling: 'replace',
    });
  }
}
