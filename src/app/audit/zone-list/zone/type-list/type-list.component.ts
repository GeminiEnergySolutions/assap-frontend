import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {switchMap, tap} from 'rxjs';
import {AuditService} from 'src/app/shared/services/audit.service';
import {EquipmentService} from 'src/app/shared/services/equipment.service';

@Component({
  selector: 'app-type-list',
  templateUrl: './type-list.component.html',
  styleUrls: ['./type-list.component.scss']
})
export class TypeListComponent implements OnInit {

  // auditId?: any;
  equipment?: any;
  // type!: string;
  types: any = [];
  typeChilds: any = [];
  subtypes: any = [];

  constructor(private auditService: AuditService,
    // private auditZoneService: AuditZoneService,
    private equipmentService: EquipmentService,
    private route: ActivatedRoute,
    private router: Router,
    // private toastService: ToastService,
  ) { }

  ngOnInit(): void {

    this.route.params.pipe(
      switchMap(({ aid, zid, eid }) => this.equipmentService.getSingleEquipment(eid)),
    ).subscribe((res: any) => {
      this.equipment = res.data;
      this.getEquipmentPercentage(this.equipment);
    });

    this.route.params.pipe(
      tap(({ aid, zid, type }) => {
        // this.type = type;
        // this.auditId = aid;
      }),
      switchMap(({ aid, zid, eid }) => {
        // return this.equipmentService.getSingleEquipmentByName(type);
        return this.equipmentService.getEquipmentTypesByEquipmentId(eid);
      }),
    ).subscribe((res: any) => {
      // this.equipment = equipment;
      // this.equipmentService.getEquipmentTypes(equipment.id).subscribe((res: any) => {
      this.types = res.data;
      this.equipmentService.equipment = this.types[0]?.equipment;
      // });
      if (this.types.length) {
        this.equipmentService.getEquipmentSubTypes(this.route.snapshot.params.aid, this.route.snapshot.params.zid, this.types[0].equipmentId).subscribe((res: any) => {
          this.subtypes = res;
        });
      }
      else {
        this.subtypes = [];
      }
    });

  }

  private getEquipmentPercentage(equipment: any) {
    this.auditService.equipmentHeadingValue = equipment.equipmentName;
    this.auditService.getEquipmentTypesPercentage(this.route.snapshot.params.aid, this.route.snapshot.params.zid, this.route.snapshot.params.eid).subscribe((res: any) => {
      this.auditService.progressPercentageZone = res.progressPercentageZone + '%';
      this.auditService.zoneTotalFields = res.zoneTotalFields;
      this.auditService.zoneRemainingFields = res.zoneRemainingFields;
    });
  }

  createType(type: any) {
    if(type.name == "Fluorescent") {
      if(!this.typeChilds || !this.typeChilds.length)
        this.equipmentService.getEquipmentTypeChilds(type.id).subscribe((res:any)=>{
          this.typeChilds = res.data;
        })
      return;
    }
    const displayType = type.name;
    const name = prompt(`New ${displayType} Name`);
    if (!name) {
      return;
    }

    let dataObj: any = {
      auditId: this.route.snapshot.params.aid,
      zoneId: this.route.snapshot.params.zid,
      // typeId: type.id,
      equipmentId: this.types[0].equipmentId,
      name: name
    };
    dataObj.typeId = type.equipmentType ? type.typeId : type.id;
    dataObj.typeChildId = type.equipmentType ? type.id : null;

    this.equipmentService.createEquipmentSubType(dataObj).subscribe((res: any) => {
      this.subtypes.push(res);

      this.getEquipmentPercentage(this.equipment);
      // const currentURL = this.router.url;
      // const urlSegments = currentURL.split('/');
      // const lastSegment = urlSegments[urlSegments.length - 1];
      // if(this.equipmentService.equipments.length && this.equipmentService.equipments.includes(lastSegment)) {
      //   this.auditService.getEquipmentTypesPercentage(this.route.snapshot.params.aid, lastSegment, this.route.snapshot.params.zid).subscribe((res: any) => {
      //     this.auditService.progressPercentageZone = res.progressPercentageZone + '%';
      //     this.auditService.zoneTotalFields = res.zoneTotalFields ;
      //     this.auditService.zoneRemainingFields = res.zoneRemainingFields ;
      //   });
      // }
    });

  }

  rename(item: any) {
    const name = prompt('Rename Type', item.name);
    if (!name) {
      return;
    }

    let objData = { ...item, name };
    this.equipmentService.updateEquipmentSubType(objData).subscribe((res: any) => {
      let index = this.subtypes.indexOf(item);
      this.subtypes[index] = res;
    });

  }

  delete(item: any) {
    if (!confirm(`Are you sure you want to delete '${item.name}'?`)) {
      return;
    }

    this.equipmentService.deleteEquipmentSubType(item.id).subscribe((res: any) => {
      let index = this.subtypes.indexOf(item);
      this.subtypes.splice(index, 1);
    })
  }

}
