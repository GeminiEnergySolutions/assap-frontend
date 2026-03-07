import {Component, inject, OnInit} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {RouterOutlet} from '@angular/router';
import {SwUpdate} from '@angular/service-worker';
import {ThemeService, ToastModule} from '@mean-stream/ngbx';
import {environment} from '../environments/environment';

import {NavBarComponent} from './nav-bar/nav-bar.component';
import {BreadcrumbService} from './shared/services/breadcrumb.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [
    NavBarComponent,
    RouterOutlet,
    ToastModule,
  ],
})
export class AppComponent implements OnInit {
  private updates = inject(SwUpdate);
  private breadcrumbService = inject(BreadcrumbService);

  constructor() {
    inject(ThemeService);

    if (!environment.production) {
      inject(Title).setTitle('Conserve [Dev]');
    }
  }

  async ngOnInit() {
    if (this.updates.isEnabled) {
      const hasUpdate = await this.updates.checkForUpdate();
      if (hasUpdate && confirm('A new app update is available. Do you want to install it? This will only take a second or two.')) {
        await this.updates.activateUpdate();
        document.location.reload();
      }
    }
  }

  activate() {
    this.breadcrumbService.setBreadcrumbs([]);
  }
}
