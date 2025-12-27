import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Theme, ThemeService} from '@mean-stream/ngbx';
import {BreadcrumbService} from '../../shared/services/breadcrumb.service';

@Component({
  selector: 'app-site',
  imports: [],
  templateUrl: './site-settings.component.html',
  styleUrl: './site-settings.component.scss'
})
export class SiteSettingsComponent implements OnInit, OnDestroy {
  private themeService = inject(ThemeService);
  private breadcrumbService = inject(BreadcrumbService);
  private route = inject(ActivatedRoute);

  selectedTheme = this.themeService.theme;

  readonly themes = [
    {name: 'System', value: 'auto', icon: 'bi-circle-half'},
    {name: 'Light', value: 'light', icon: 'bi-sun'},
    {name: 'Dark', value: 'dark', icon: 'bi-moon-stars'},
  ];

  ngOnInit() {
    this.breadcrumbService.pushBreadcrumb({
      label: 'Site Settings',
      class: 'bi-toggles',
      routerLink: '.',
      relativeTo: this.route,
    });
  }

  ngOnDestroy() {
    this.breadcrumbService.popBreadcrumb();
  }

  selectTheme(value: Theme) {
    this.selectedTheme = value;
    this.themeService.theme = value;
  }
}
