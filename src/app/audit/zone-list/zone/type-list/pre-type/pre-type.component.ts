import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs';
import { AuditZoneService } from 'src/app/shared/services/audit-zone.service';
import { AuditService } from 'src/app/shared/services/audit.service';
import { EquipmentService } from 'src/app/shared/services/equipment.service';

@Component({
  selector: 'app-pre-type',
  templateUrl: './pre-type.component.html',
  styleUrls: ['./pre-type.component.scss']
})
export class PreTypeComponent implements OnInit {

  audit?: any;
  zone?: any;
  equipment?: any;
  // type?: string;
  overFlow: boolean = false;

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
      switchMap(({ aid, zid, eid }) => this.equipmentService.getSingleEquipment(eid)),
    ).subscribe((res: any) => {
      this.equipment = res.data;
    });
  }

  getOverFlow(overFlow: boolean) {
    this.overFlow = overFlow;
  }

}
