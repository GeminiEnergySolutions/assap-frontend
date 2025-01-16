import {Component} from '@angular/core';
import {RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';

@Component({
  selector: 'app-master-detail',
  templateUrl: './master-detail.component.html',
  styleUrls: ['./master-detail.component.scss'],
  imports: [
    RouterLinkActive,
    RouterOutlet,
    RouterLink,
  ],
})
export class MasterDetailComponent {
}
