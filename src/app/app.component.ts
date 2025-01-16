import {Component, OnInit} from '@angular/core';
import {SwUpdate} from '@angular/service-worker';
import {NavBarComponent} from './nav-bar/nav-bar.component';
import {RouterOutlet} from '@angular/router';
import {ToastModule} from '@mean-stream/ngbx';

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
  constructor(
    private updates: SwUpdate,
  ) {
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
}
