import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Theme, ThemeService} from '@mean-stream/ngbx';
import {BreadcrumbService} from '../../shared/services/breadcrumb.service';

@Component({
  selector: 'app-site',
  imports: [],
  templateUrl: './site.component.html',
  styleUrl: './site.component.scss'
})
export class SiteComponent implements OnInit, OnDestroy {

  selectedTheme = this.themeService.theme;

  readonly themes = [
    {name: 'System', value: 'auto', icon: 'bi-circle-half'},
    {name: 'Light', value: 'light', icon: 'bi-sun'},
    {name: 'Dark', value: 'dark', icon: 'bi-moon-stars'},
  ];

  constructor(
    private themeService: ThemeService,
    private breadcrumbService: BreadcrumbService,
    private route: ActivatedRoute,
  ) {
  }

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
