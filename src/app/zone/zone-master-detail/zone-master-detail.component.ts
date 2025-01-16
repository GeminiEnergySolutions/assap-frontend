import {TitleCasePipe} from '@angular/common';
import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {switchMap} from 'rxjs';

import {MasterDetailComponent} from '../../shared/components/master-detail/master-detail.component';
import {icons} from '../../shared/icons';
import {Audit} from '../../shared/model/audit.interface';
import {AuditService} from '../../shared/services/audit.service';
import {Breadcrumb, BreadcrumbService} from '../../shared/services/breadcrumb.service';
import {ZoneListComponent} from '../zone-list/zone-list.component';

@Component({
  selector: 'app-zone-master-detail',
  templateUrl: './zone-master-detail.component.html',
  styleUrls: ['./zone-master-detail.component.scss'],
  imports: [
    MasterDetailComponent,
    RouterLink,
    ZoneListComponent,
    TitleCasePipe,
  ],
})
export class ZoneMasterDetailComponent implements OnInit {
  audit?: Audit;

  constructor(
    private auditService: AuditService,
    private breadcrumbService: BreadcrumbService,
    private route: ActivatedRoute,
  ) {
  }

  ngOnInit(): void {
    const auditBreadcrumb: Breadcrumb = {label: '', class: icons.audit, routerLink: '..', relativeTo: this.route};
    this.breadcrumbService.setBreadcrumbs([
      {label: 'Audits', routerLink: '../..', relativeTo: this.route},
      auditBreadcrumb,
      {label: 'Zones', routerLink: '.', relativeTo: this.route},
    ]);

    this.route.params.pipe(
      switchMap(({aid}) => this.auditService.getSingleAudit(aid)),
    ).subscribe(({data}) => {
      this.audit = data;
      auditBreadcrumb.label = data.auditName;
    });
  }
}
