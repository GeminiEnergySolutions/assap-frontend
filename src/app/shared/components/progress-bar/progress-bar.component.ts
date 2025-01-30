import {Component, Input} from '@angular/core';
import {PercentageCompletion} from '../../model/percentage-completion.interface';

@Component({
  selector: 'app-progress-bar',
  templateUrl: './progress-bar.component.html',
  styleUrl: './progress-bar.component.scss',
})
export class ProgressBarComponent {
  /**
   * The progress to show.
   * If undefined, the progress bar will be at 0%.
   */
  @Input({required: true}) progress?: PercentageCompletion;

  /**
   * Whether to show the status as a label or not.
   * If false, only progress bar.
   */
  @Input() status = true;
}
