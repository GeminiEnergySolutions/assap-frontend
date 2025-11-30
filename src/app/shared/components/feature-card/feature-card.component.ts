import {Component, inject, Input, OnInit} from '@angular/core';
import {RouterLink} from '@angular/router';
import {BehaviorSubject, of, switchMap} from 'rxjs';
import {PercentageCompletion} from '../../model/percentage-completion.interface';
import {AuditService, PercentageQuery} from '../../services/audit.service';
import {ProgressBarComponent} from '../progress-bar/progress-bar.component';

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
  private auditService = inject(AuditService);

  @Input() icon?: string;
  @Input({required: true}) title!: string;
  @Input() subtitle?: string;
  @Input({required: true}) routerLink!: string | unknown[];

  readonly percentageQuery$ = new BehaviorSubject<PercentageQuery | undefined>(undefined);

  progress?: PercentageCompletion;

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
