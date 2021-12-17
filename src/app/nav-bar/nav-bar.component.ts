import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {Config} from '../audits/model/config.interface';
import {ParseService} from '../parse/parse.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss'],
})
export class NavBarComponent implements OnInit, OnDestroy {
  menuCollapsed: boolean = true;

  config?: Config;

  subscription?: Subscription;

  constructor(
    private parseService: ParseService,
  ) {
  }

  ngOnInit() {
    this.subscription = this.parseService.getConfig$<Config>().subscribe(config => {
      this.config = config;
    });
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }
}
