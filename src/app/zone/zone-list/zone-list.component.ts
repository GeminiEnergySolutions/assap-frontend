import {Component, inject, OnInit} from '@angular/core';
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
export class ZoneListComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private zoneService = inject(AuditZoneService);
  private toastService = inject(ToastService);
  private promptModalService = inject(PromptModalService);

  zones?: Zone[];
  search = '';

  ngOnInit(): void {
    this.route.params.pipe(
      switchMap(({aid}) => this.zoneService.getAllAuditZone(aid)),
    ).subscribe(({data}) => {
      this.zones = data;
    });
  }

  createPrompt(): void {
    this.promptModalService.prompt(this.promptModalService.simplePrompt(
      'Create Zone',
      'Name',
      'Create',
    )).then(({value}) => this.create(value));
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

  deleteConfirm(zone: Zone) {
    this.promptModalService.prompt(this.promptModalService.confirmDanger({
      title: 'Delete Zone',
      titleContextKey: 'zoneName',
      text: 'Are you sure you want to delete this zone?',
      dangerText: 'This action cannot be undone!',
      submitLabel: 'Yes, Delete',
      cancelLabel: 'No, Cancel',
    }, {
      type: 'checkbox',
    }), {
      zoneName: zone.zoneName,
    }).then(() => this.delete(zone.zoneId));
  }

  delete(zoneId: number) {
    this.zoneService.deleteAuditZone(+this.route.snapshot.params.aid, zoneId).subscribe(() => {
      const index = this.zones!.findIndex(a => a.zoneId === zoneId);
      this.zones!.splice(index, 1);
      this.toastService.warn('Delete Zone', 'Successfully deleted zone.');
    });
  }

  duplicatePrompt(zone: Zone) {
    this.promptModalService.prompt<{ count: number }>({
      title: 'Duplicate Zone',
      titleContextKey: 'zoneName',
      text: 'Please select how many duplicates should be created, or leave blank to create one.',
      submitLabel: 'Duplicate',
      schema: [{
        key: 'count',
        dataType: 'integer',
        type: 'textBox',
        title: 'Number of Duplicates',
        hint: '',
        required: true,
        defaultValue: 1,
      }],
    }, {
      zoneId: zone.zoneId,
      zoneName: zone.zoneName,
    }).then(({count}) => this.duplicate(zone.zoneId, count));
  }

  duplicate(zoneId: number, count: number) {
    this.zoneService.duplicateAuditZone(+this.route.snapshot.params.aid, zoneId, count).subscribe(response => {
      this.zones!.push(...response.data);
      this.toastService.success('Duplicate Zone', 'Successfully duplicated zone.');
    });
  }
}
