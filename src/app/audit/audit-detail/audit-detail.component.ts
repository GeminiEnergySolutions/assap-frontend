import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, RouterLink, RouterOutlet} from '@angular/router';
import {switchMap} from 'rxjs';
import {AuditService} from '../../shared/services/audit.service';
import {Audit} from '../../shared/model/audit.interface';
import {OptionsDropdownComponent} from '../options-dropdown/options-dropdown.component';
import {ProgressBarComponent} from '../../shared/components/progress-bar/progress-bar.component';
import {FeatureCardComponent} from '../../shared/components/feature-card/feature-card.component';
import {TitleCasePipe} from '@angular/common';

@Component({
  selector: 'app-audit-detail',
  templateUrl: './audit-detail.component.html',
  styleUrls: ['./audit-detail.component.scss'],
  imports: [
    RouterLink,
    OptionsDropdownComponent,
    ProgressBarComponent,
    FeatureCardComponent,
    RouterOutlet,
    TitleCasePipe,
  ],
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
