import {Component, Input, OnInit} from '@angular/core';
import {AuditService, PercentageQuery} from '../../shared/services/audit.service';
import {PercentageCompletion} from '../../shared/model/percentage-completion.interface';
import {BehaviorSubject, of, switchMap} from 'rxjs';

@Component({
  selector: 'app-feature-card',
  templateUrl: './feature-card.component.html',
  styleUrl: './feature-card.component.scss',
})
export class FeatureCardComponent implements OnInit {
  @Input({required: true}) title!: string;
  @Input({required: true}) routerLink!: any[] | string;

  readonly percentageQuery$ = new BehaviorSubject<PercentageQuery | undefined>(undefined);

  progress?: PercentageCompletion;

  constructor(
    private readonly auditService: AuditService,
  ) {
  }

  @Input()
  set percentageQuery(query: PercentageQuery) {
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
