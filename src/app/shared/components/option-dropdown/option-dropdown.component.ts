import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-option-dropdown',
  templateUrl: './option-dropdown.component.html',
  styleUrls: ['./option-dropdown.component.scss'],
  standalone: false,
})
export class OptionDropdownComponent {

  @Input() id!: string;

}
