import {Component} from '@angular/core';
import {Theme, ThemeService} from '@mean-stream/ngbx';

@Component({
  selector: 'app-site',
  imports: [],
  templateUrl: './site.component.html',
  styleUrl: './site.component.scss'
})
export class SiteComponent {

  selectedTheme = this.themeService.theme;

  readonly themes = [
    {name: 'System', value: 'auto', icon: 'bi-circle-half'},
    {name: 'Light', value: 'light', icon: 'bi-sun'},
    {name: 'Dark', value: 'dark', icon: 'bi-moon-stars'},
  ];

  constructor(
    private themeService: ThemeService,
  ) {
  }

  selectTheme(value: Theme) {
    this.selectedTheme = value;
    this.themeService.theme = value;
  }
}
