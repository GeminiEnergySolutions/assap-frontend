import {Component, Input} from '@angular/core';
import {NgbDropdown, NgbDropdownMenu, NgbDropdownToggle} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-option-dropdown',
  templateUrl: './option-dropdown.component.html',
  styleUrls: ['./option-dropdown.component.scss'],
  imports: [
    NgbDropdown,
    NgbDropdownMenu,
    NgbDropdownToggle,
  ],
})
export class OptionDropdownComponent {

  @Input() id!: string;

}
