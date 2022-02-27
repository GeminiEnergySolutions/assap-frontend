import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {switchMap} from 'rxjs/operators';
import {Schema} from '../../forms/schema';
import {SchemaService} from '../../forms/schema.service';
import {Zone} from '../model/audit.interface';
import {ZoneService} from '../zone.service';

@Component({
  selector: 'app-zone',
  templateUrl: './zone.component.html',
  styleUrls: ['./zone.component.scss'],
})
export class ZoneComponent implements OnInit {
  types!: string[];
  zone?: Zone;

  constructor(
    private zoneService: ZoneService,
    private schemaService: SchemaService,
    public route: ActivatedRoute,
  ) {
  }

  ngOnInit(): void {
    this.schemaService.loadSchemas(undefined, null, ['type']).subscribe(schemas => {
      this.types = Array.from(new Set(schemas.map(s => s.type).filter(t => t !== 'Preaudit')));
    });

    this.route.params.pipe(
      switchMap(({aid, zid}) => this.zoneService.get(aid, zid)),
    ).subscribe(zone => {
      this.zone = zone;
    });
  }
}
