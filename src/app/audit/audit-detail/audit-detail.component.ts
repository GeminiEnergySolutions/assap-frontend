import {TitleCasePipe} from '@angular/common';
import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, RouterLink, RouterOutlet} from '@angular/router';
import {switchMap, tap} from 'rxjs';

import {FeatureCardComponent} from '../../shared/components/feature-card/feature-card.component';
import {ProgressBarComponent} from '../../shared/components/progress-bar/progress-bar.component';
import {icons} from '../../shared/icons';
import {Audit} from '../../shared/model/audit.interface';
import {AuditService} from '../../shared/services/audit.service';
import {Breadcrumb, BreadcrumbService} from '../../shared/services/breadcrumb.service';
import {AuditOptionsDropdownComponent} from '../audit-options-dropdown/audit-options-dropdown.component';

@Component({
  selector: 'app-audit-detail',
  templateUrl: './audit-detail.component.html',
  styleUrls: ['./audit-detail.component.scss'],
  imports: [
    RouterLink,
    ProgressBarComponent,
    FeatureCardComponent,
    RouterOutlet,
    TitleCasePipe,
    AuditOptionsDropdownComponent,
  ],
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
    const breadcrumb: Breadcrumb = {label: '', class: icons.audit, routerLink: '.', relativeTo: this.route};
    this.breadcrumbService.pushBreadcrumb(breadcrumb);

    this.route.params.pipe(
      tap(() => {
        this.audit = undefined;
        breadcrumb.label = '';
      }),
      switchMap(({aid}) => this.auditService.getSingleAudit(aid)),
    ).subscribe(({data}) => {
      this.audit = data;
      breadcrumb.label = data.auditName;
    });

    this.route.params.pipe(
      switchMap(({aid}) => this.auditService.getPercentage({
        progressType: 'complete',
        auditId: aid,
      })),
    ).subscribe(res => this.auditService.currentProgress = res);
  }

  ngOnDestroy() {
    this.breadcrumbService.popBreadcrumb();
  }
}
