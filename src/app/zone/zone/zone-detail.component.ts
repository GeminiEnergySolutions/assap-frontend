import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ToastService} from '@mean-stream/ngbx';
import {switchMap} from 'rxjs';
import {AuditZoneService} from 'src/app/shared/services/audit-zone.service';
import {AuditService} from 'src/app/shared/services/audit.service';
import {EquipmentService} from 'src/app/shared/services/equipment.service';
import {PercentageCompletion} from '../../shared/model/percentage-completion.interface';
import {EquipmentCategory} from '../../shared/model/equipment.interface';
import {Audit} from '../../shared/model/audit.interface';
import {Zone} from '../../shared/model/zone.interface';

@Component({
  selector: 'app-zone-detail',
  templateUrl: './zone-detail.component.html',
  styleUrls: ['./zone-detail.component.scss'],
})
export class ZoneDetailComponent implements OnInit {
  audit?: Audit;
  zone?: Zone;
  equipments: EquipmentCategory[] = [];
  progress?: PercentageCompletion;

  constructor(
    private auditZoneService: AuditZoneService,
    private auditService: AuditService,
    private equipmentService: EquipmentService,
    private zoneService: AuditZoneService,
    public route: ActivatedRoute,
    private toastService: ToastService,
  ) {
  }

  ngOnInit(): void {
    this.route.params.pipe(
      switchMap(({aid}) => this.auditService.getSingleAudit(aid)),
    ).subscribe(({data}) => {
      this.audit = data;
    });

    this.route.params.pipe(
      switchMap(({zid}) => this.auditZoneService.getSingleZone(zid)),
    ).subscribe(res => {
      this.zone = res.data;
    });

    this.equipmentService.getEquipmentCategories().subscribe(res => {
      this.equipments = res.data;
    });

    this.route.params.pipe(
      switchMap(({zid}) => this.auditService.getPercentage({
        percentageType: 'zone',
        zoneId: zid,
      })),
    ).subscribe(res => this.progress = res);
  }

  rename() {
    if (!this.zone) {
      return;
    }
    const name = prompt('Rename Zone', this.zone.zoneName);
    if (!name) {
      return;
    }
    this.zoneService.updateAuditZone({...this.zone, zoneName: name}, this.zone.zoneId).subscribe(() => {
      this.zone!.zoneName = name;
      this.toastService.success('Rename Zone', 'Successfully renamed zone.');
    });
  }

  uploadPhoto(file: File) {
    const {aid, zid} = this.route.snapshot.params;
    const formData = new FormData();
    formData.append('auditId', aid);
    formData.append('zoneId', zid);
    formData.append('photo', file, file.name);
    this.auditService.uploadPhoto(aid, formData).subscribe(() => {
      this.toastService.success('Upload Zone Photo', `Sucessfully uploaded photo for Zone '${this.zone?.zoneName}'.`);
    });
  }
}
