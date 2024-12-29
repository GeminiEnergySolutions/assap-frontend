import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {switchMap} from 'rxjs';
import {AuditService} from 'src/app/shared/services/audit.service';
import {Audit} from '../../shared/model/audit.interface';
import {MasterDetailComponent} from '../../shared/components/master-detail/master-detail.component';
import {ZoneListComponent} from '../zone-list/zone-list.component';
import {TitleCasePipe} from '@angular/common';

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
    private route: ActivatedRoute,
  ) {
  }

  ngOnInit(): void {
    this.route.params.pipe(
      switchMap(({aid}) => this.auditService.getSingleAudit(aid)),
    ).subscribe(res => {
      this.audit = res.data;
    });
  }
}
