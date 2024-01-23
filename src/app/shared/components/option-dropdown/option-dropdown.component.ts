import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-option-dropdown',
  templateUrl: './option-dropdown.component.html',
  styleUrls: ['./option-dropdown.component.scss']
})
export class OptionDropdownComponent {

  @Input() id!: string;

}
