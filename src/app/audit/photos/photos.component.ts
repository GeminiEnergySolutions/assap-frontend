import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { ActivatedRoute } from '@angular/router';
import { AuditService } from 'src/app/shared/services/audit.service';
import { AuditZoneService } from 'src/app/shared/services/audit-zone.service';
import { EquipmentService } from 'src/app/shared/services/equipment.service';

@Component({
  selector: 'app-photos',
  templateUrl: './photos.component.html',
  styleUrls: ['./photos.component.scss']
})
export class PhotosComponent implements OnInit {

  @ViewChild(MatPaginator, { static: false }) paginator: any;
  
  photoType: string = 'All';
  zoneList: any = [];
  zone: Number = 0;
  equipmentList: any = [];
  equipment: Number = 0;
  subTypeList: any = [];
  subType: Number = 0;
  data: any = [];
  data2 = [];
  dataForLength = [];
 
  page = 0;
  size = 8;

  constructor(private route: ActivatedRoute,
    private auditService: AuditService,
    private auditZoneService: AuditZoneService,
    private equipmentService: EquipmentService,
  ) { }

  ngOnInit() {
    this.getPhotos();
    this.equipmentService.getAllEquipments().subscribe((res: any) => {
      this.equipmentList = res.data;
    });
  }

  getPhotos() {
    this.auditService.getPhotos(this.route.snapshot.params.aid).subscribe((photos: any) => {
      // console.log(photos);
      this.data2 = photos.data;
      this.getData({ pageIndex: this.page, pageSize: this.size });
    })
  }

  updatePhotosFilter(){
    this.getData({ pageIndex: 0, pageSize: 8 });
  }

  getData(obj: any) {

    let index = 0,
      startingIndex = obj.pageIndex * obj.pageSize,
      endingIndex = startingIndex + obj.pageSize;

    if (this.photoType === 'Audit') {
      this.dataForLength = this.data2.filter((a: any) => !a.zoneId && !a.equipmentId)
      this.data = this.dataForLength.filter((a: any) => {
        index++;
        return (index > startingIndex && index <= endingIndex && !a.zoneId && !a.equipmentId) ? true : false;
      });
    }
    else if (this.photoType === 'Zone') {
      
      if(this.subType) {
        this.dataForLength = this.data2.filter((a: any) => a.zoneId === Number(this.zone) && a.equipmentId === Number(this.equipment) && a.subTypeId === Number(this.subType))
        this.data = this.dataForLength.filter((a: any) => {
          index++;
          return (index > startingIndex && index <= endingIndex && a.zoneId === Number(this.zone) && a.equipmentId === Number(this.equipment) && a.subTypeId === Number(this.subType)) ? true : false;
        });
      }
      else if(this.equipment) {
        this.dataForLength = this.data2.filter((a: any) => a.zoneId === Number(this.zone) && a.equipmentId === Number(this.equipment))
        this.data = this.dataForLength.filter((a: any) => {
          index++;
          return (index > startingIndex && index <= endingIndex && a.zoneId === Number(this.zone) && a.equipmentId === Number(this.equipment)) ? true : false;
        });
      }
      else if(this.zone) {
        this.dataForLength = this.data2.filter((a: any) => a.zoneId === Number(this.zone) && !a.equipmentId)
        this.data = this.dataForLength.filter((a: any) => {
          index++;
          return (index > startingIndex && index <= endingIndex && a.zoneId === Number(this.zone) && !a.equipmentId) ? true : false;
        });
      }
      else {
        this.dataForLength = this.data2.filter((a: any) => a.zoneId && !a.equipmentId)
        this.data = this.dataForLength.filter((a: any) => {
          index++;
          return (index > startingIndex && index <= endingIndex && a.zoneId && !a.equipmentId) ? true : false;
        });
      }

    }
    else {
      if(this.equipment) {
        this.dataForLength = this.data2.filter((a: any) => a.equipmentId === Number(this.equipment))
        this.data = this.dataForLength.filter((a: any) => {
          index++;
          return (index > startingIndex && index <= endingIndex && a.equipmentId === Number(this.equipment)) ? true : false;
        });
      } else {
        this.dataForLength = this.data2;
        this.data = this.dataForLength.filter((a: any) => {
          index++;
          return (index > startingIndex && index <= endingIndex) ? true : false;
        });
      }
    }
    // this.data = this.data2.filter((a: any) => {
    //   index++;
    //   if (this.photoType === 'Audit') {
    //     return (index > startingIndex && index <= endingIndex && !a.zoneId && !a.equipmentId) ? true : false;
    //   }
    //   else if (this.photoType === 'Zone') {
    //     return (index > startingIndex && index <= endingIndex && a.zoneId && !a.equipmentId) ? true : false;
    //   }
    //   else {
    //     return (index > startingIndex && index <= endingIndex) ? true : false;
    //   }
    // });
    // this.dataForLength = this.data2.filter((a: any) => this.photoType === 'Audit' ? (!a.zoneId && !a.equipmentId) : this.photoType === 'Zone' ? (a.zoneId && !a.equipmentId) : true)
  }

  changePhotoType() {
    this.zoneList = [];
    this.zone = 0;
    this.equipment = 0;
    this.subTypeList = [];
    this.subType = 0;

    if (this.photoType === 'Zone') {
      this.getAllAuditZone(this.route.snapshot.params.aid);
    }
    this.getPhotos();
    // this.getData({ pageIndex: 0, pageSize: 8 });
  }

  getAllAuditZone(auditId: number) {
    this.auditZoneService.getAllAuditZone(auditId).subscribe((res: any) => {
      this.zoneList = res.data;
    })
  }

  changeZone() {
    this.equipment = 0;
    this.getData({ pageIndex: 0, pageSize: 8 });
  
  }

  changeEquipment() {
    this.subType = 0;
    this.subTypeList = [];

    this.getData({ pageIndex: 0, pageSize: 8 });
   
    this.getEquipmentSubTypes(this.equipment);
  }

  getEquipmentSubTypes(equipmentId: Number) {
    this.equipmentService.getEquipmentSubTypes(this.route.snapshot.params.aid, Number(this.zone), equipmentId).subscribe((res: any[]) => {
      this.subTypeList = res;
    })
  }
  changeSubType() {
    this.getData({ pageIndex: 0, pageSize: 8 });
     }

}
  // let index = 0,
    //   startingIndex = 0,
    //   endingIndex = 8;

    // this.data = this.data2.filter((a: any) => {
    //   index++;
    //   return (index > startingIndex && index <= endingIndex && a.zoneId === Number(this.zone) && !a.equipmentId) ? true : false;
    // });
    // this.dataForLength = this.data2.filter((a: any) => a.zoneId === Number(this.zone) && !a.equipmentId)
 // let index = 0,
    //   startingIndex = 0,
    //   endingIndex = 8;

    // this.data = this.data2.filter((a: any) => {
    //   index++;
    //   return (index > startingIndex && index <= endingIndex && a.zoneId === Number(this.zone) && a.equipmentId === Number(this.equipment)) ? true : false;
    // });
    // this.dataForLength = this.data2.filter((a: any) => a.zoneId === Number(this.zone) && a.equipmentId === Number(this.equipment))

// let index = 0,
    //   startingIndex = 0,
    //   endingIndex = 8;

    // this.data = this.data2.filter((a: any) => {
    //   index++;
    //   return (index > startingIndex && index <= endingIndex && a.zoneId === Number(this.zone) && a.equipmentId === Number(this.equipment) && a.subTypeId === Number(this.subType)) ? true : false;
    // });
    // this.dataForLength = this.data2.filter((a: any) => a.zoneId === Number(this.zone) && a.equipmentId === Number(this.equipment) && a.subTypeId === Number(this.subType))
 
 //  = [
  //   { id: 1, url: 'https://images.freeimages.com/images/large-previews/996/easter-1399885.jpg' },
  //   { id: 2, url: 'https://images.freeimages.com/images/large-previews/0b3/burning-tree-1377053.jpg' },
  //   { id: 3, url: 'https://images.freeimages.com/images/large-previews/346/cemetery-1404186.jpg' },
  //   { id: 4, url: 'https://images.freeimages.com/images/large-previews/310/resting-peacefully-1574880.jpg' },
  //   { id: 5, url: 'https://images.freeimages.com/images/large-previews/aae/lomo-spider-1386711.jpg' },
  //   { id: 6, url: 'https://images.freeimages.com/images/large-previews/996/easter-1399885.jpg' },
  //   { id: 7, url: 'https://images.freeimages.com/images/large-previews/0b3/burning-tree-1377053.jpg' },
  //   { id: 8, url: 'https://images.freeimages.com/images/large-previews/346/cemetery-1404186.jpg' },
  //   { id: 1, url: 'https://images.freeimages.com/images/large-previews/996/easter-1399885.jpg' },
  //   { id: 2, url: 'https://images.freeimages.com/images/large-previews/0b3/burning-tree-1377053.jpg' },
  //   { id: 3, url: 'https://images.freeimages.com/images/large-previews/346/cemetery-1404186.jpg' },
  //   { id: 4, url: 'https://images.freeimages.com/images/large-previews/310/resting-peacefully-1574880.jpg' },
  //   { id: 5, url: 'https://images.freeimages.com/images/large-previews/aae/lomo-spider-1386711.jpg' },
  //   { id: 6, url: 'https://images.freeimages.com/images/large-previews/996/easter-1399885.jpg' },
  //   { id: 7, url: 'https://images.freeimages.com/images/large-previews/0b3/burning-tree-1377053.jpg' },
  //   { id: 8, url: 'https://images.freeimages.com/images/large-previews/346/cemetery-1404186.jpg' },
  //   { id: 1, url: 'https://images.freeimages.com/images/large-previews/996/easter-1399885.jpg' },
  //   { id: 2, url: 'https://images.freeimages.com/images/large-previews/0b3/burning-tree-1377053.jpg' },
  //   { id: 3, url: 'https://images.freeimages.com/images/large-previews/346/cemetery-1404186.jpg' },
  //   { id: 4, url: 'https://images.freeimages.com/images/large-previews/310/resting-peacefully-1574880.jpg' },
  //   { id: 5, url: 'https://images.freeimages.com/images/large-previews/aae/lomo-spider-1386711.jpg' },
  //   { id: 6, url: 'https://images.freeimages.com/images/large-previews/996/easter-1399885.jpg' },
  //   { id: 7, url: 'https://images.freeimages.com/images/large-previews/0b3/burning-tree-1377053.jpg' },
  //   { id: 8, url: 'https://images.freeimages.com/images/large-previews/346/cemetery-1404186.jpg' },
  //   { id: 1, url: 'https://images.freeimages.com/images/large-previews/996/easter-1399885.jpg' },
  //   { id: 2, url: 'https://images.freeimages.com/images/large-previews/0b3/burning-tree-1377053.jpg' },
  //   { id: 3, url: 'https://images.freeimages.com/images/large-previews/346/cemetery-1404186.jpg' },
  //   { id: 4, url: 'https://images.freeimages.com/images/large-previews/310/resting-peacefully-1574880.jpg' },
  //   { id: 5, url: 'https://images.freeimages.com/images/large-previews/aae/lomo-spider-1386711.jpg' },
  //   { id: 6, url: 'https://images.freeimages.com/images/large-previews/996/easter-1399885.jpg' },
  //   { id: 7, url: 'https://images.freeimages.com/images/large-previews/0b3/burning-tree-1377053.jpg' },
  //   { id: 8, url: 'https://images.freeimages.com/images/large-previews/346/cemetery-1404186.jpg' },
  //   { id: 1, url: 'https://images.freeimages.com/images/large-previews/996/easter-1399885.jpg' },
  //   { id: 2, url: 'https://images.freeimages.com/images/large-previews/0b3/burning-tree-1377053.jpg' },
  //   { id: 3, url: 'https://images.freeimages.com/images/large-previews/346/cemetery-1404186.jpg' },
  //   { id: 4, url: 'https://images.freeimages.com/images/large-previews/310/resting-peacefully-1574880.jpg' },
  //   { id: 5, url: 'https://images.freeimages.com/images/large-previews/aae/lomo-spider-1386711.jpg' },
  //   { id: 6, url: 'https://images.freeimages.com/images/large-previews/996/easter-1399885.jpg' },
  //   { id: 7, url: 'https://images.freeimages.com/images/large-previews/0b3/burning-tree-1377053.jpg' },
  //   { id: 8, url: 'https://images.freeimages.com/images/large-previews/346/cemetery-1404186.jpg' },
  //   { id: 1, url: 'https://images.freeimages.com/images/large-previews/996/easter-1399885.jpg' },
  //   { id: 2, url: 'https://images.freeimages.com/images/large-previews/0b3/burning-tree-1377053.jpg' },
  //   { id: 3, url: 'https://images.freeimages.com/images/large-previews/346/cemetery-1404186.jpg' },
  //   { id: 4, url: 'https://images.freeimages.com/images/large-previews/310/resting-peacefully-1574880.jpg' },
  //   { id: 5, url: 'https://images.freeimages.com/images/large-previews/aae/lomo-spider-1386711.jpg' },
  //   { id: 6, url: 'https://images.freeimages.com/images/large-previews/996/easter-1399885.jpg' },
  //   { id: 7, url: 'https://images.freeimages.com/images/large-previews/0b3/burning-tree-1377053.jpg' },
  //   { id: 8, url: 'https://images.freeimages.com/images/large-previews/346/cemetery-1404186.jpg' },
  //   { id: 1, url: 'https://images.freeimages.com/images/large-previews/996/easter-1399885.jpg' },
  //   { id: 2, url: 'https://images.freeimages.com/images/large-previews/0b3/burning-tree-1377053.jpg' },
  //   { id: 3, url: 'https://images.freeimages.com/images/large-previews/346/cemetery-1404186.jpg' },
  //   { id: 4, url: 'https://images.freeimages.com/images/large-previews/310/resting-peacefully-1574880.jpg' },
  //   { id: 5, url: 'https://images.freeimages.com/images/large-previews/aae/lomo-spider-1386711.jpg' },
  //   { id: 6, url: 'https://images.freeimages.com/images/large-previews/996/easter-1399885.jpg' },
  //   { id: 7, url: 'https://images.freeimages.com/images/large-previews/0b3/burning-tree-1377053.jpg' },
  //   { id: 8, url: 'https://images.freeimages.com/images/large-previews/346/cemetery-1404186.jpg' },
  //   { id: 1, url: 'https://images.freeimages.com/images/large-previews/996/easter-1399885.jpg' },
  //   { id: 2, url: 'https://images.freeimages.com/images/large-previews/0b3/burning-tree-1377053.jpg' },
  //   { id: 3, url: 'https://images.freeimages.com/images/large-previews/346/cemetery-1404186.jpg' },
  //   { id: 4, url: 'https://images.freeimages.com/images/large-previews/310/resting-peacefully-1574880.jpg' },
  //   { id: 5, url: 'https://images.freeimages.com/images/large-previews/aae/lomo-spider-1386711.jpg' },
  //   { id: 6, url: 'https://images.freeimages.com/images/large-previews/996/easter-1399885.jpg' },
  //   { id: 7, url: 'https://images.freeimages.com/images/large-previews/0b3/burning-tree-1377053.jpg' },
  //   { id: 8, url: 'https://images.freeimages.com/images/large-previews/346/cemetery-1404186.jpg' },
  //   { id: 1, url: 'https://images.freeimages.com/images/large-previews/996/easter-1399885.jpg' },
  //   { id: 2, url: 'https://images.freeimages.com/images/large-previews/0b3/burning-tree-1377053.jpg' },
  //   { id: 3, url: 'https://images.freeimages.com/images/large-previews/346/cemetery-1404186.jpg' },
  //   { id: 4, url: 'https://images.freeimages.com/images/large-previews/310/resting-peacefully-1574880.jpg' },
  //   { id: 5, url: 'https://images.freeimages.com/images/large-previews/aae/lomo-spider-1386711.jpg' },
  //   { id: 6, url: 'https://images.freeimages.com/images/large-previews/996/easter-1399885.jpg' },
  //   { id: 7, url: 'https://images.freeimages.com/images/large-previews/0b3/burning-tree-1377053.jpg' },
  //   { id: 8, url: 'https://images.freeimages.com/images/large-previews/346/cemetery-1404186.jpg' },
  //   { id: 1, url: 'https://images.freeimages.com/images/large-previews/996/easter-1399885.jpg' },
  //   { id: 2, url: 'https://images.freeimages.com/images/large-previews/0b3/burning-tree-1377053.jpg' },
  //   { id: 3, url: 'https://images.freeimages.com/images/large-previews/346/cemetery-1404186.jpg' },
  //   { id: 4, url: 'https://images.freeimages.com/images/large-previews/310/resting-peacefully-1574880.jpg' },
  //   { id: 5, url: 'https://images.freeimages.com/images/large-previews/aae/lomo-spider-1386711.jpg' },
  //   { id: 6, url: 'https://images.freeimages.com/images/large-previews/996/easter-1399885.jpg' },
  //   { id: 7, url: 'https://images.freeimages.com/images/large-previews/0b3/burning-tree-1377053.jpg' },
  //   { id: 8, url: 'https://images.freeimages.com/images/large-previews/346/cemetery-1404186.jpg' },
  // ];
