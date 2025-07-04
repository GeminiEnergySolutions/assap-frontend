import {TitleCasePipe} from '@angular/common';
import {Component, OnInit} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {ActivatedRoute, Router, RouterLink, RouterLinkActive} from '@angular/router';
import {ToastService} from '@mean-stream/ngbx';
import {NgbDropdownButtonItem, NgbDropdownItem, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {EMPTY, switchMap} from 'rxjs';

import {FeatureCardComponent} from '../../shared/components/feature-card/feature-card.component';
import {ListPlaceholderComponent} from '../../shared/components/list-placeholder/list-placeholder.component';
import {PromptModalService} from '../../shared/components/prompt-modal/prompt-modal.service';
import {Equipment, EquipmentCategory} from '../../shared/model/equipment.interface';
import {Zone} from '../../shared/model/zone.interface';
import {SearchPipe} from '../../shared/pipe/search.pipe';
import {AuditZoneService} from '../../shared/services/audit-zone.service';
import {AuditService} from '../../shared/services/audit.service';
import {EquipmentService} from '../../shared/services/equipment.service';
import {EquipmentOptionsDropdownComponent} from '../equipment-options-dropdown/equipment-options-dropdown.component';

@Component({
  selector: 'app-equipment-list',
  templateUrl: './equipment-list.component.html',
  styleUrls: ['./equipment-list.component.scss'],
  imports: [
    RouterLink,
    FeatureCardComponent,
    NgbDropdownItem,
    NgbDropdownButtonItem,
    TitleCasePipe,
    EquipmentOptionsDropdownComponent,
    ListPlaceholderComponent,
    FormsModule,
    SearchPipe,
    RouterLinkActive,
  ],
})
export class EquipmentListComponent implements OnInit {
  category?: EquipmentCategory;
  equipments?: Equipment[];
  zones?: Zone[];
  search = '';

  constructor(
    private auditService: AuditService,
    private zoneService: AuditZoneService,
    protected equipmentService: EquipmentService,
    private toastService: ToastService,
    public route: ActivatedRoute,
    private router: Router,
    protected modal: NgbModal,
    private promptModalService: PromptModalService,
  ) {
  }

  ngOnInit(): void {
    this.route.params.pipe(
      switchMap(({eid}) => this.equipmentService.getEquipmentCategory(eid)),
    ).subscribe(res => {
      this.category = res.data;
      this.getEquipmentPercentage(this.category);
    });

    this.route.params.pipe(
      switchMap(({zid, eid}) => this.equipmentService.getEquipments(zid, eid)),
    ).subscribe(({data}) => {
      this.equipments = data;
    });

    this.route.queryParams.pipe(
      switchMap(({new: newId}) => {
        if (!newId) {
          return EMPTY;
        }
        return this.equipmentService.getEquipment(+this.route.snapshot.params.zid, +this.route.snapshot.params.eid, newId);
      }),
    ).subscribe(({data}) => {
      if (!this.equipments) {
        return;
      }

      const index = this.equipments.findIndex(e => e.id === data.id);
      if (index >= 0) {
        this.equipments[index] = data;
      } else {
        this.equipments.push(data);
      }
      this.router.navigate(['.'], {relativeTo: this.route, queryParams: {new: null}});
    });
  }

  loadZones() {
    if (this.zones) {
      return;
    }
    this.zones = [];
    this.zoneService.getAllAuditZone(this.route.snapshot.params.aid).subscribe(res => {
      this.zones = res.data;
    });
  }

  private getEquipmentPercentage(category: EquipmentCategory) {
    this.auditService.getPercentage({
      progressType: 'equipment',
      auditId: this.route.snapshot.params.aid,
      zoneId: this.route.snapshot.params.zid,
      equipmentId: category.id,
    }).subscribe(res => this.auditService.currentProgress = res);
  }

  delete(item: Equipment) {
    const kind = item.type?.name;
    this.promptModalService.prompt(this.promptModalService.confirmDanger({
      title: `Delete ${kind}`,
      text: `Are you sure you want to delete '${item.name}'?`,
      dangerText: 'This action cannot be undone.',
      submitLabel: 'Yes, Delete',
    }, {
      type: 'checkbox',
    })).then(() => {
      this.equipmentService.deleteEquipment(item.zoneId, item.equipmentId, item.id).subscribe(() => {
        const index = this.equipments!.indexOf(item);
        this.equipments!.splice(index, 1);
        this.toastService.warn('Delete Equipment', `Successfully deleted ${kind}`);
        this.getEquipmentPercentage(this.category!);
      });
    });
  }

  duplicate(item: Equipment) {
    const kind = item.type?.name;
    this.equipmentService.duplicateEquipment(item.id, item.zoneId).subscribe(({data}) => {
      this.toastService.success('Duplicate Equipment', `Successfully duplicated ${kind}`);
      this.equipments!.push(data);
    });
  }
}
