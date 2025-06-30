import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {ActivatedRoute, RouterLink, RouterLinkActive} from '@angular/router';
import {ToastService} from '@mean-stream/ngbx';
import {NgbDropdownButtonItem, NgbDropdownItem} from '@ng-bootstrap/ng-bootstrap';
import {switchMap} from 'rxjs';

import {FeatureCardComponent} from '../../shared/components/feature-card/feature-card.component';
import {ListPlaceholderComponent} from '../../shared/components/list-placeholder/list-placeholder.component';
import {PromptModalService} from '../../shared/components/prompt-modal/prompt-modal.service';
import {Zone} from '../../shared/model/zone.interface';
import {SearchPipe} from '../../shared/pipe/search.pipe';
import {AuditZoneService} from '../../shared/services/audit-zone.service';
import {ZoneOptionsDropdownComponent} from '../zone-options-dropdown/zone-options-dropdown.component';

@Component({
  selector: 'app-zone-list',
  templateUrl: './zone-list.component.html',
  styleUrls: ['./zone-list.component.scss'],
  imports: [
    FeatureCardComponent,
    RouterLink,
    NgbDropdownButtonItem,
    NgbDropdownItem,
    ZoneOptionsDropdownComponent,
    ListPlaceholderComponent,
    FormsModule,
    SearchPipe,
    RouterLinkActive,
  ],
})
export class ZoneListComponent implements OnInit, OnDestroy {
  zones?: Zone[];
  search = '';

  constructor(
    private route: ActivatedRoute,
    private zoneService: AuditZoneService,
    private toastService: ToastService,
    private promptModalService: PromptModalService,
  ) {
  }

  ngOnInit(): void {
    this.promptModalService.setOptionsPrompt(
      'zone-list-create',
      'Create Zone',
      'Name',
      'Create',
      name => this.create(name),
    );

    this.route.params.pipe(
      switchMap(({aid}) => this.zoneService.getAllAuditZone(aid)),
    ).subscribe(({data}) => {
      this.zones = data;
    });
  }

  ngOnDestroy() {
    this.promptModalService.clearOptions('zone-list-create');
  }

  createPrompt(): void {
    this.promptModalService.prompt('zone-list-create');
  }

  create(name: string) {
    this.zoneService.createAuditZone({
      auditId: this.route.snapshot.params.aid,
      zoneName: name,
    }).subscribe(({data}) => {
      this.zones!.push(data);
      this.toastService.success('Create Zone', 'Successfully created new zone.');
    });
  }

  delete(zone: Zone) {
    if (!confirm(`Are you sure you want to delete '${zone.zoneName}'?`)) {
      return;
    }
    this.zoneService.deleteAuditZone(zone.auditId, zone.zoneId).subscribe(() => {
      const index = this.zones!.findIndex(a => a.zoneId === zone.zoneId);
      this.zones!.splice(index, 1);
      this.toastService.warn('Delete Zone', 'Successfully deleted zone.');
    });
  }

  duplicate(zone: Zone) {
    const count = prompt('How many duplicates?', '1');
    if (!count || isNaN(+count)) {
      return;
    }
    this.zoneService.duplicateAuditZone(zone.auditId, zone.zoneId, +count).subscribe(response => {
      this.zones!.push(...response.data);
      this.toastService.success('Duplicate Zone', 'Successfully duplicated zone.');
    });
  }
}
