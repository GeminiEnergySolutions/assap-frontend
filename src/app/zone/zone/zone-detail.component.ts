import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {ToastService} from '@mean-stream/ngbx';
import {switchMap} from 'rxjs';
import {AuditZoneService} from 'src/app/shared/services/audit-zone.service';
import {AuditService} from 'src/app/shared/services/audit.service';
import {EquipmentService} from 'src/app/shared/services/equipment.service';
import {PercentageCompletion} from '../../shared/model/percentage-completion.interface';
import {EquipmentCategory} from '../../shared/model/equipment.interface';
import {Audit} from '../../shared/model/audit.interface';
import {Zone} from '../../shared/model/zone.interface';
import {PhotoService} from '../../shared/services/photo.service';
import {
  NgbDropdown,
  NgbDropdownButtonItem,
  NgbDropdownItem,
  NgbDropdownMenu,
  NgbDropdownToggle,
} from '@ng-bootstrap/ng-bootstrap';
import {ProgressBarComponent} from '../../shared/components/progress-bar/progress-bar.component';
import {FeatureCardComponent} from '../../shared/components/feature-card/feature-card.component';
import {PhotoCaptureComponent} from '../../shared/components/photo-capture/photo-capture.component';
import {TitleCasePipe} from '@angular/common';

@Component({
  selector: 'app-zone-detail',
  templateUrl: './zone-detail.component.html',
  styleUrls: ['./zone-detail.component.scss'],
  imports: [
    RouterLink,
    NgbDropdown,
    NgbDropdownToggle,
    NgbDropdownMenu,
    NgbDropdownButtonItem,
    NgbDropdownItem,
    ProgressBarComponent,
    FeatureCardComponent,
    PhotoCaptureComponent,
    TitleCasePipe,
  ],
})
export class ZoneDetailComponent implements OnInit {
  audit?: Audit;
  zone?: Zone;
  equipments: EquipmentCategory[] = [];
  progress?: PercentageCompletion;

  constructor(
    private auditZoneService: AuditZoneService,
    private auditService: AuditService,
    private photoService: PhotoService,
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
      switchMap(({aid, zid}) => this.auditZoneService.getSingleZone(aid, zid)),
    ).subscribe(res => {
      this.zone = res.data;
    });

    this.equipmentService.getEquipmentCategories().subscribe(res => {
      this.equipments = res.data;
    });

    this.route.params.pipe(
      switchMap(({aid, zid}) => this.auditService.getPercentage({
        percentageType: 'zone',
        auditId: aid,
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
    this.zoneService.updateAuditZone(this.zone.auditId, this.zone.zoneId, {
      ...this.zone,
      zoneName: name,
    }).subscribe(() => {
      this.zone!.zoneName = name;
      this.toastService.success('Rename Zone', 'Successfully renamed zone.');
    });
  }

  uploadPhoto(file: File) {
    if (!this.zone) {
      return;
    }

    this.photoService.uploadPhoto({
      auditId: this.zone.auditId,
      zoneId: this.zone.zoneId,
    }, file).subscribe(() => {
      this.toastService.success('Upload Zone Photo', `Sucessfully uploaded photo for Zone '${this.zone?.zoneName}'.`);
    });
  }
}
