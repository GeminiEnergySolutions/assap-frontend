import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {switchMap} from 'rxjs';
import {AuditZoneService} from 'src/app/shared/services/audit-zone.service';
import {AuditService} from 'src/app/shared/services/audit.service';
import {EquipmentService} from 'src/app/shared/services/equipment.service';
import {EquipmentCategory} from '../../shared/model/equipment.interface';

@Component({
  selector: 'app-equipment-master-detail',
  templateUrl: './equipment-master-detail.component.html',
  styleUrls: ['./equipment-master-detail.component.scss']
})
export class EquipmentMasterDetailComponent implements OnInit {

  audit?: any;
  zone?: any;
  equipment?: EquipmentCategory;

  constructor(private route: ActivatedRoute,
    private auditService: AuditService,
    private auditZoneService: AuditZoneService,
    public equipmentService: EquipmentService,
  ) { }

  ngOnInit(): void {
    // this.route.params.subscribe(({type}) => {
    //   this.type = type;
    // });

    this.route.params.pipe(
      switchMap(({ aid }) => this.auditService.getSingleAudit(aid)),
    ).subscribe((res: any) => {
      this.audit = res.data;
    });

    this.route.params.pipe(
      switchMap(({ aid, zid }) => this.auditZoneService.getSingleZone(zid)),
    ).subscribe((res: any) => {
      this.zone = res.data;
    });

    this.route.params.pipe(
      switchMap(({ aid, zid, eid }) => this.equipmentService.getEquipmentCategory(eid)),
    ).subscribe(res => {
      this.equipment = res.data;
    });
  }
}
