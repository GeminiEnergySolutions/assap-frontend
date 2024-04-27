import {Component, Input, OnInit} from '@angular/core';
import {AuditService, PercentageQuery} from '../../shared/services/audit.service';
import {PercentageCompletion} from '../../shared/model/percentage-completion.interface';

@Component({
  selector: 'app-feature-card',
  templateUrl: './feature-card.component.html',
  styleUrl: './feature-card.component.scss',
})
export class FeatureCardComponent implements OnInit {
  @Input({required: true}) title!: string;
  @Input({required: true}) routerLink!: any[] | string;

  @Input() percentageQuery?: PercentageQuery;

  progress?: PercentageCompletion;

  constructor(
    private readonly auditService: AuditService,
  ) {
  }

  ngOnInit() {
    this.percentageQuery && this.auditService.getPercentage(this.percentageQuery).subscribe(res => {
      this.progress = res;
    });
  }
}
