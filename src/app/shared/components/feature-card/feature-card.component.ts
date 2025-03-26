import {Component, Input, OnInit} from '@angular/core';
import {AuditService, PercentageQuery} from '../../services/audit.service';
import {PercentageCompletion} from '../../model/percentage-completion.interface';
import {BehaviorSubject, of, switchMap} from 'rxjs';
import {ProgressBarComponent} from '../progress-bar/progress-bar.component';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-feature-card',
  templateUrl: './feature-card.component.html',
  styleUrl: './feature-card.component.scss',
  imports: [
    ProgressBarComponent,
    RouterLink,
  ],
})
export class FeatureCardComponent implements OnInit {
  @Input({required: true}) title!: string;
  @Input() subtitle?: string;
  @Input({required: true}) routerLink!: string | unknown[];

  readonly percentageQuery$ = new BehaviorSubject<PercentageQuery | undefined>(undefined);

  progress?: PercentageCompletion;

  constructor(
    private readonly auditService: AuditService,
  ) {
  }

  @Input()
  set percentageQuery(query: PercentageQuery | undefined) {
    this.percentageQuery$.next(query);
  }

  ngOnInit() {
    this.percentageQuery$.pipe(
      switchMap(query => query ? this.auditService.getPercentage(query) : of(undefined)),
    ).subscribe(res => {
      this.progress = res;
    });
  }
}
