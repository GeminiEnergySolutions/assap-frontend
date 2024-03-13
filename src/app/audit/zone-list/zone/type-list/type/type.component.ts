import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ToastService} from '@mean-stream/ngbx';
import {switchMap} from 'rxjs';
import {AuditService} from 'src/app/shared/services/audit.service';
import {EquipmentService} from 'src/app/shared/services/equipment.service';


@Component({
  selector: 'app-type',
  templateUrl: './type.component.html',
  styleUrls: ['./type.component.scss']
})
export class TypeComponent implements OnInit {

  constructor(
    public equipmentService: EquipmentService,
    public auditService: AuditService,
    private route: ActivatedRoute,
    private toastService: ToastService,
  ) { }

  ngOnInit(): void {
    this.route.params
    .pipe(
      switchMap(({ eid, tid }) => {
        const queryParams = `?percentageType=form&subTypeId=${tid}`;
        return this.auditService.getPercentage(queryParams);
      })
    )
    .subscribe((res: any) => {
      this.route.snapshot.params.tid
      this.auditService.totalFields = res.totalFields ;
      this.auditService.completedFields = res.completedFields ;
      this.auditService.progressPercentage = res.percentage + '%';
    });
  }

  uploadPhoto(files: FileList | null) {
    if (!files || !files.length) {
      return;
    }

    const {aid, tid, zid} = this.route.snapshot.params;
    const formData = new FormData();
    formData.append('auditId', aid);
    formData.append('zoneId', zid);
    formData.append('equipmentId', this.equipmentService.equipmentSubTypeData.equipmentId);
    formData.append('typeId', this.equipmentService.equipmentSubTypeData?.type?.id);
    formData.append('subTypeId', tid);
    formData.append('photo', files[0], files[0].name);
    this.auditService.uploadPhoto(aid, formData).subscribe(() => {
      this.toastService.success('Upload Equipment Photo', `Sucessfully uploaded photo for ${this.equipmentService.equipmentSubTypeData?.type?.name} '${this.equipmentService.equipmentSubTypeData?.name}'.`);
    });
  }
}
