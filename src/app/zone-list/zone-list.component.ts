import {Component, Input, OnInit} from '@angular/core';
import {AuditService} from '../audit.service';
import {Audit} from '../model/audit.interface';

@Component({
  selector: 'app-zone-list',
  templateUrl: './zone-list.component.html',
  styleUrls: ['./zone-list.component.scss'],
})
export class ZoneListComponent implements OnInit {
  @Input() audit: Audit;
  @Input() routerLink = '';

  constructor(
    private auditService: AuditService,
  ) {
  }

  ngOnInit(): void {
  }

  createZone() {
    const name = prompt('New Zone Name');
    if (!name) {
      return;
    }

    this.auditService.createZone(this.audit, {name}).subscribe(zone => {
      this.audit.zone[zone.id] = zone;
    });
  }
}
