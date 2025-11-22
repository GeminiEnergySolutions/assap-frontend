import {CurrencyPipe, DecimalPipe} from '@angular/common';
import {Component, inject, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {registerables} from 'chart.js';
import {
  ChoroplethChart,
  ChoroplethController,
  ColorScale,
  GeoFeature,
  ProjectionScale,
  topojson,
} from 'chartjs-chart-geo';
import {BaseChartDirective, provideCharts, withDefaultRegisterables} from 'ng2-charts';
import {switchMap} from 'rxjs';
import us from 'us-atlas/states-10m.json';
import {DashboardService, SummaryResult} from '../dashboard.service';
import equivalents from './equivalents.json';

@Component({
  selector: 'app-dashboard',
  imports: [
    DecimalPipe,
    BaseChartDirective,
    CurrencyPipe,
  ],
  providers: [
    provideCharts(withDefaultRegisterables(ChoroplethController, GeoFeature, ProjectionScale, ColorScale, ...registerables)),
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  @ViewChild(BaseChartDirective) coffeeChart?: BaseChartDirective;

  private readonly route = inject(ActivatedRoute);
  private readonly dashboardService = inject(DashboardService);

  results: SummaryResult[] = [];
  totalGHGSavings = 0;
  totalEnergySavings = 0;
  totalCostSavings = 0;

  ghgEquivalent = this.random(equivalents.ghg);
  energyEquivalent = this.random(equivalents.energy);
  costsEquivalent = this.random(equivalents.costs);

  mapData?: ChoroplethChart['data'];

  ngOnInit() {
    // @ts-expect-error taken from the example, can't bother with the types
    const nation = topojson.feature(us, us.objects.nation).features[0];
    // @ts-expect-error see above
    const states = topojson.feature(us, us.objects.states).features;

    this.route.queryParams.pipe(
      switchMap(({state}) => this.dashboardService.getDataSummary(+state)),
    ).subscribe(({data}) => {
      this.results = data;

      this.totalGHGSavings = data.reduce((a, c) => a + c.GHG_emissions_savings, 0);
      this.totalEnergySavings = data.reduce((a, c) => a + c.kBTU_per_year_savings, 0);
      this.totalCostSavings = data.reduce((a, c) => a + c.cost_per_year_savings, 0);

      this.mapData = {
        labels: states.map((d: any) => d.properties.name),
        datasets: [{
          label: 'States',
          outline: nation,
          data: states.map((d: any) => {
            const stateName: string = d.properties.name;
            return ({
              feature: d,
              value: data.find(state => state.state_name === stateName)?.GHG_emissions_savings ?? 0,
            });
          }),
        }],
      };
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
