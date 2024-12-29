import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {switchMap} from 'rxjs';
import {AuditZoneService} from 'src/app/shared/services/audit-zone.service';
import {AuditService} from 'src/app/shared/services/audit.service';
import {EquipmentService} from 'src/app/shared/services/equipment.service';
import {EquipmentCategory} from '../../shared/model/equipment.interface';
import {Audit} from '../../shared/model/audit.interface';
import {Zone} from '../../shared/model/zone.interface';
import {MasterDetailComponent} from '../../shared/components/master-detail/master-detail.component';
import {EquipmentListComponent} from '../equipment-list/equipment-list.component';
import {TitleCasePipe} from '@angular/common';

@Component({
  selector: 'app-equipment-master-detail',
  templateUrl: './equipment-master-detail.component.html',
  styleUrls: ['./equipment-master-detail.component.scss'],
  imports: [
    MasterDetailComponent,
    RouterLink,
    EquipmentListComponent,
    TitleCasePipe,
  ],
})
export class EquipmentMasterDetailComponent implements OnInit {
  audit?: Audit;
  zone?: Zone;
  equipment?: EquipmentCategory;

  constructor(
    private route: ActivatedRoute,
    private auditService: AuditService,
    private auditZoneService: AuditZoneService,
    public equipmentService: EquipmentService,
  ) {
  }

  ngOnInit(): void {
    this.route.params.pipe(
      switchMap(({aid}) => this.auditService.getSingleAudit(aid)),
    ).subscribe(({data}) => {
      this.audit = data;
    });

    this.route.params.pipe(
      switchMap(({aid, zid}) => this.auditZoneService.getSingleZone(aid, zid)),
    ).subscribe(({data}) => {
      this.zone = data;
    });

    this.route.params.pipe(
      switchMap(({aid, zid, eid}) => this.equipmentService.getEquipmentCategory(eid)),
    ).subscribe(({data}) => {
      this.equipment = data;
    });
  }
}
