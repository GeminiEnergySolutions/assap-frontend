import {Component, inject, Input} from '@angular/core';
import {NgbOffcanvas, NgbTooltip} from '@ng-bootstrap/ng-bootstrap';
import {SafePipe} from '../../pipe/safe.pipe';

@Component({
  selector: 'app-help-icon',
  imports: [
    SafePipe,
    NgbTooltip,
  ],
  templateUrl: './help-icon.component.html',
  styleUrl: './help-icon.component.scss'
})
export class HelpIconComponent {
  @Input({required: true}) title!: string;
  @Input() summary?: string;
  @Input() docs?: string;

  ngbOffcanvas = inject(NgbOffcanvas);
}
