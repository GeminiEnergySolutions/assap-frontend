import {AsyncPipe, DatePipe, DecimalPipe, KeyValuePipe, SlicePipe} from '@angular/common';
import {Component, inject, OnDestroy, OnInit, Pipe, PipeTransform} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {ToastService} from '@mean-stream/ngbx';
import {NgbNav, NgbNavItem, NgbNavLink, NgbPagination, NgbTooltip} from '@ng-bootstrap/ng-bootstrap';
import {combineLatest, map, Observable, of, switchMap} from 'rxjs';
import {PromptModalService} from '../../shared/components/prompt-modal/prompt-modal.service';
import {icons} from '../../shared/icons';
import {FilterReportsDto, Report, ReportType} from '../../shared/model/report.interface';
import {AuditService} from '../../shared/services/audit.service';
import {Breadcrumb, BreadcrumbService} from '../../shared/services/breadcrumb.service';


@Pipe({name: 'headReport'})
export class HeadReport implements PipeTransform {
  private readonly auditService = inject(AuditService);

  transform(report: Report): Observable<Report> {
    return report._head ? of(report) : this.auditService.headReport(report).pipe(
      map(res => {
        report._head = {
          size: +(res.headers.get('content-length') ?? 0),
          type: res.headers.get('content-type') ?? 'unknown',
          etag: res.headers.get('etag') ?? '-',
        };
        return report;
      }),
    );
  }
}

@Component({
  selector: 'app-reports',
  imports: [
    NgbPagination,
    DatePipe,
    NgbTooltip,
    SlicePipe,
    NgbNav,
    KeyValuePipe,
    RouterLink,
    NgbNavLink,
    NgbNavItem,
    FormsModule,
    AsyncPipe,
    HeadReport,
    DecimalPipe,
  ],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.scss',
})
export class ReportsComponent implements OnInit, OnDestroy {
  protected readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly breadcrumbService = inject(BreadcrumbService);
  private readonly auditService = inject(AuditService);
  private readonly promptModalService = inject(PromptModalService);
  private readonly toastService = inject(ToastService);

  protected readonly icons = icons;

  protected reports: Report[] = [];
  protected totalReports = 0;

  protected query: FilterReportsDto & Required<Pick<FilterReportsDto, 'size' | 'pageNo'>> = {
    size: 20,
    pageNo: 1,
  };
  protected readonly reportTypes = {
    energy_audit: 'Energy Audit',
    feasibility: 'Feasibility',
    microgrid: 'Microgrid Sheet',
    '10_per_design_prep': '10% Design Prep',
  };
  protected readonly fileTypes = {
    'text/csv': {title: 'CSV', extension: '.csv', icon: 'bi-file-earmark-spreadsheet'},
    'application/pdf': {title: 'PDF', extension: '.pdf', icon: 'bi-file-earmark-richtext'},
    'application/zip': {title: 'Zip', extension: '.zip', icon: 'bi-file-earmark-zip'},
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': {
      title: 'Word Document',
      extension: '.docx',
      icon: 'bi-file-earmark-word',
    },
  };
  protected readonly fileExtensions = Object.values(this.fileTypes).map(v => v.extension).join(', ');
  protected readonly fileMimeTypes = Object.keys(this.fileTypes).join(',');

  protected uploadFiles: string[] = [];
  protected uploadReportType: ReportType = 'energy_audit';

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
        } else {
          delete this.query.type;
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

  protected deleteReport(report: Report) {
    this.promptModalService.prompt(this.promptModalService.confirmDanger({
      title: 'Delete Report',
      text: `Are you sure you want to delete this report?`,
      dangerText: 'This action cannot be undone.',
      submitLabel: 'Yes, Delete',
    }, {
      type: 'checkbox',
    })).then(() => {
      this.auditService.deleteReport(report.id).subscribe(() => {
        this.reports = this.reports.filter(r => r.id !== report.id);
        this.totalReports--;
      });
    });
  }

  protected uploadReport(type: string, files: FileList | null, button: HTMLButtonElement) {
    if (!files?.length) {
      return;
    }
    const file = files[0];
    if (file.size > 16 * 1024 * 1024) {
      this.toastService.error('Upload Report', 'Selected file must be smaller than 16 MiB.');
      return;
    }

    button.disabled = true;
    this.auditService.uploadReport({
      auditId: +this.route.snapshot.params.aid,
      type: type as ReportType,
    }, file).subscribe({
      next: report => {
        button.disabled = false;
        this.reports.push(report);
        this.totalReports++;
        this.toastService.success('Upload Report', `Successfully uploaded report file "${file.name}".`);
      },
      error: () => button.disabled = false,
    });
  }
}
