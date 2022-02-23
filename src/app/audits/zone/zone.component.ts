import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {switchMap} from 'rxjs/operators';
import {Zone} from '../model/audit.interface';
import {Types} from '../model/types';
import {ZoneService} from '../zone.service';

@Component({
  selector: 'app-zone',
  templateUrl: './zone.component.html',
  styleUrls: ['./zone.component.scss'],
})
export class ZoneComponent implements OnInit {
  types = Types;
  zone?: Zone;

  constructor(
    private zoneService: ZoneService,
    public route: ActivatedRoute,
  ) {
  }

  ngOnInit(): void {
    this.route.params.pipe(
      switchMap(({aid, zid}) => this.zoneService.get(aid, zid)),
    ).subscribe(zone => {
      this.zone = zone;
    });
  }
}
