import {NgTemplateOutlet, TitleCasePipe} from '@angular/common';
import {Component, DestroyRef, inject, OnInit} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {Router, RouterLink, RouterLinkActive} from '@angular/router';
import {NgbOffcanvas, NgbTooltip} from '@ng-bootstrap/ng-bootstrap';

import {AuthService} from '../shared/services/auth.service';
import {Breadcrumb, BreadcrumbService} from '../shared/services/breadcrumb.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss'],
  imports: [
    RouterLinkActive,
    RouterLink,
    TitleCasePipe,
    NgbTooltip,
    NgTemplateOutlet,
  ],
})
export class NavBarComponent implements OnInit {
  protected authService = inject(AuthService);
  protected offcanvas = inject(NgbOffcanvas);
  protected breadcrumbService = inject(BreadcrumbService);
  private destroyRef = inject(DestroyRef);
  private router = inject(Router);

  protected breadcrumbs: Breadcrumb[] = [];

  ngOnInit() {
    this.breadcrumbService.breadcrumbs$.pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe(breadcrumbs => this.breadcrumbs = breadcrumbs);
  }

  logout(): void {
    this.authService.logout().subscribe(() => {
      localStorage.clear();
      this.authService.currentLoginUser = undefined;
      this.router.navigate(['/auth/login']);
    })
  }

  reportProblem() {
    const subject = `Conserve - Support Request`;
    const user = this.authService.currentLoginUser;
    const body = `\
# Support Request

**Situation:**
(Please describe what you were doing when the problem occurred)
-

**Problem:**
(Please describe the problem)
-

**Expected Behavior:**
(Please describe your expected behavior)
-

**Additional Context:**
(Please give additional details about your setup or environment, e.g. internet connectivity)
-

**Metadata:**
(This is automatically filled out, please do not remove)
- URL: ${location.origin + this.router.url}
- Location: ${this.breadcrumbs.map(b => b.label).join(' > ') || '-'}
- User: ${user ? `${user.userName} <${user.email}> Role: ${user.role?.role ?? '-'} ID: ${user.id}` : '-'}
    `;
    const email = `support@geminiesolutions.com`;
    const mailto = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    if (!window.open(mailto)) {
      window.location.href = mailto;
    }
  }
}
