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
    {name: 'Sync with OS', value: 'auto', icon: 'bi-circle-half', selectedIcon: 'bi-check-circle-fill'},
    {name: 'Light', value: 'light', icon: 'bi-sun', selectedIcon: 'bi-sun-fill'},
    {name: 'Dark', value: 'dark', icon: 'bi-moon-stars', selectedIcon: 'bi-moon-stars-fill'},
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
