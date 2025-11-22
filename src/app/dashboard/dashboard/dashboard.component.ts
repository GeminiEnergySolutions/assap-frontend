import {DecimalPipe} from '@angular/common';
import {Component, inject, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {switchMap} from 'rxjs';
import {DashboardService, SummaryResult} from '../dashboard.service';
import equivalents from './equivalents.json';

@Component({
  selector: 'app-dashboard',
  imports: [
    DecimalPipe,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly dashboardService = inject(DashboardService);

  results: SummaryResult[] = [];
  totalGHGSavings = 0;
  totalEnergySavings = 0;
  totalCostSavings = 0;

  ghgEquivalent = this.random(equivalents.ghg);
  energyEquivalent = this.random(equivalents.energy);
  costsEquivalent = this.random(equivalents.costs);

  ngOnInit() {
    this.route.queryParams.pipe(
      switchMap(({state}) => this.dashboardService.getDataSummary(+state)),
    ).subscribe(({data}) => {
      this.results = data;

      this.totalGHGSavings = data.reduce((a, c) => a + c.GHG_emissions_savings, 0);
      this.totalEnergySavings = data.reduce((a, c) => a + c.kBTU_per_year_savings, 0);
      this.totalCostSavings = data.reduce((a, c) => a + c.cost_per_year_savings, 0);
    });
  }

  random<T>(arr: T[], current?: T): T {
    let result: T;
    do {
      result = arr[Math.floor(Math.random() * arr.length)];
    } while (result === current && arr.length > 1);
    return result;
  }

  protected readonly equivalents = equivalents;
}
