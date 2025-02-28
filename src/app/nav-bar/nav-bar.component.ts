import {AsyncPipe, TitleCasePipe} from '@angular/common';
import {Component} from '@angular/core';
import {Router, RouterLink, RouterLinkActive} from '@angular/router';
import {NgbOffcanvas} from '@ng-bootstrap/ng-bootstrap';

import {AuthService} from '../shared/services/auth.service';
import {BreadcrumbService} from '../shared/services/breadcrumb.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss'],
  imports: [
    RouterLinkActive,
    RouterLink,
    TitleCasePipe,
    AsyncPipe,
  ],
})
export class NavBarComponent {
  constructor(
    public authService: AuthService,
    protected offcanvas: NgbOffcanvas,
    private router: Router,
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
}
