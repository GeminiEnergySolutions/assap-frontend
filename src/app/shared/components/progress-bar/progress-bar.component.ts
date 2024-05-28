import {Component, Input} from '@angular/core';
import {PercentageCompletion} from '../../model/percentage-completion.interface';

@Component({
  selector: 'app-progress-bar',
  templateUrl: './progress-bar.component.html',
  styleUrl: './progress-bar.component.scss'
})
export class ProgressBarComponent {
  @Input({required: true}) progress?: PercentageCompletion;
}
