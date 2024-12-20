import {Component, OnInit} from '@angular/core';
import {AuditService} from 'src/app/shared/services/audit.service';
import {ToastService} from '@mean-stream/ngbx';
import {Audit} from '../../shared/model/audit.interface';
import {ActivatedRoute} from '@angular/router';
import {switchMap} from 'rxjs';
import {User} from '../../shared/model/user.interface';

@Component({
  selector: 'app-add-data-collector-modal',
  templateUrl: './add-data-collector-modal.component.html',
  styleUrls: ['./add-data-collector-modal.component.scss'],
})
export class AddDataCollectorModalComponent implements OnInit {
  audit?: Audit;
  dataCollectors: User[] = [];
  selected: Partial<Record<number, boolean>> = {};

  constructor(
    private auditService: AuditService,
    private toastService: ToastService,
    private route: ActivatedRoute,
  ) {
  }

  ngOnInit(): void {
    this.route.params.pipe(
      switchMap(({aid}) => this.auditService.getSingleAudit(aid)),
    ).subscribe(({data}) => this.audit = data);

    this.route.params.pipe(
      switchMap(({aid}) => this.auditService.dataCollectors(aid)),
    ).subscribe(({data}) => {
      this.dataCollectors = data;
      this.selected = {};
    });
  }

  onOkClick(): void {
    const assigned = this.dataCollectors
      .filter(d => this.selected[d.id])
      .map(d => ({
        auditId: this.audit!.auditId,
        dataCollectorId: d.id,
      }));
    if (!assigned.length) {
      return;
    }
    this.auditService.assignAudits(assigned).subscribe(() => {
      this.toastService.success('Success', `Audit Assignment successful`);
    });
  }
}
