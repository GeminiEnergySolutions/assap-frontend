import { Component } from '@angular/core';
import {FormsModule} from "../../shared/form/form.module";

@Component({
  selector: 'app-preaudit-form',
  standalone: true,
    imports: [
        FormsModule
    ],
  templateUrl: './preaudit-form.component.html',
  styleUrl: './preaudit-form.component.scss'
})
export class PreauditFormComponent {

}
