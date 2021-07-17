import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-options-dropdown',
  templateUrl: './options-dropdown.component.html',
  styleUrls: ['./options-dropdown.component.scss'],
})
export class OptionsDropdownComponent {
  @Input() id: string;
}
