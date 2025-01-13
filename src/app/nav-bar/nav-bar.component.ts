import {TitleCasePipe} from '@angular/common';
import {Component} from '@angular/core';
import {Router, RouterLink, RouterLinkActive} from '@angular/router';
import {ThemeService} from '@mean-stream/ngbx';
import {
  NgbDropdown,
  NgbDropdownButtonItem,
  NgbDropdownItem,
  NgbDropdownMenu,
  NgbDropdownToggle,
  NgbOffcanvas,
} from '@ng-bootstrap/ng-bootstrap';

import {AuthService} from '../shared/services/auth.service';
import {BreadcrumbService} from '../shared/services/breadcrumb.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss'],
  imports: [
    RouterLinkActive,
    RouterLink,
    NgbDropdown,
    NgbDropdownToggle,
    NgbDropdownMenu,
    NgbDropdownButtonItem,
    NgbDropdownItem,
    TitleCasePipe,
  ],
})
export class NavBarComponent {

  selectedTheme = this.themeService.theme;

  readonly themes = [
    {name: 'Sync with OS', value: 'auto', icon: 'bi-circle-half', selectedIcon: 'bi-check-circle-fill'},
    {name: 'Light', value: 'light', icon: 'bi-sun', selectedIcon: 'bi-sun-fill'},
    {name: 'Dark', value: 'dark', icon: 'bi-moon-stars', selectedIcon: 'bi-moon-stars-fill'},
  ];

  constructor(
    public authService: AuthService,
    protected offcanvas: NgbOffcanvas,
    private router: Router,
    private themeService: ThemeService,
    protected breadcrumbService: BreadcrumbService,
  ) {
  }

  logout(): void {
    this.authService.logout().subscribe(() => {
      localStorage.clear();
      this.authService.currentLoginUser = undefined;
      this.router.navigate(['/auth/login']);
    })
  }

  selectTheme(value: string) {
    this.selectedTheme = value;
    this.themeService.theme = value;
  }
}
