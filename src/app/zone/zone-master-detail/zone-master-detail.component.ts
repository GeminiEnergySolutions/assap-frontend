import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {switchMap} from 'rxjs';
import {AuditService} from 'src/app/shared/services/audit.service';
import {Audit} from '../../shared/model/audit.interface';
import {Breadcrumb, BreadcrumbService} from '../../shared/services/breadcrumb.service';

@Component({
  selector: 'app-zone-master-detail',
  templateUrl: './zone-master-detail.component.html',
  styleUrls: ['./zone-master-detail.component.scss'],
  standalone: false,
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
    const auditBreadcrumb: Breadcrumb = {label: '<Audit>', routerLink: '..', relativeTo: this.route};
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
