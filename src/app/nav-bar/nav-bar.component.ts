import {AsyncPipe, NgTemplateOutlet, TitleCasePipe} from '@angular/common';
import {Component, inject} from '@angular/core';
import {Router, RouterLink, RouterLinkActive} from '@angular/router';
import {NgbOffcanvas, NgbTooltip} from '@ng-bootstrap/ng-bootstrap';

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
    NgbTooltip,
    NgTemplateOutlet,
  ],
})
export class NavBarComponent {
  protected authService = inject(AuthService);
  protected offcanvas = inject(NgbOffcanvas);
  protected breadcrumbService = inject(BreadcrumbService);
  private router = inject(Router);

  logout(): void {
    this.authService.logout().subscribe(() => {
      localStorage.clear();
      this.authService.currentLoginUser = undefined;
      this.router.navigate(['/auth/login']);
    })
  }
}
