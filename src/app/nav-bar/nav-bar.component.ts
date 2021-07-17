import {Component, OnInit} from '@angular/core';
import {Config} from '../audits/model/config.interface';
import {ParseService} from '../parse/parse.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss'],
})
export class NavBarComponent implements OnInit {
  menuCollapsed: boolean = true;

  config?: Config;

  constructor(
    private parseService: ParseService,
  ) {
  }

  ngOnInit() {
    this.parseService.getConfig$<Config>().subscribe(config => {
      this.config = config;
    });
  }
}
