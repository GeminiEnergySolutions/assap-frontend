import {DecimalPipe} from '@angular/common';
import {Component, input} from '@angular/core';
import equivalents from '../dashboard/equivalents.json';

@Component({
  selector: 'app-saving-stats',
  imports: [
    DecimalPipe,
  ],
  templateUrl: './saving-stats.component.html',
  styleUrl: './saving-stats.component.scss',
})
export class SavingStatsComponent {

  protected readonly equivalents = equivalents;

  ghgSavings = input(0);
  energySavings = input(0);
  costSavings = input(0);

  ghgEquivalent = this.random(equivalents.ghg);
  energyEquivalent = this.random(equivalents.energy);
  costsEquivalent = this.random(equivalents.costs);

  random<T>(arr: T[], current?: T): T {
    let result: T;
    do {
      result = arr[Math.floor(Math.random() * arr.length)];
    } while (result === current && arr.length > 1);
    return result;
  }
}
