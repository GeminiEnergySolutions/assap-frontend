import {Component, OnInit} from '@angular/core';
import {SwUpdate} from '@angular/service-worker';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'conserve';

  constructor(private updates: SwUpdate) {
  }

  ngOnInit() {
    this.updates.available.subscribe(() => {
      if (confirm('A new app update is available. Do you want to install it? This will only take a second or two.')) {
        this.updates.activateUpdate().then(() => document.location.reload());
      }
    });
  }
}
