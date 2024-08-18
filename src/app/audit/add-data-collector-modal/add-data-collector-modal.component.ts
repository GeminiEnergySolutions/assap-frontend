import {Component, OnInit} from '@angular/core';
import {DataCollector} from '../../shared/model/data-collector.interface';
import {AuditService} from 'src/app/shared/services/audit.service';
import {ToastService} from '@mean-stream/ngbx';
import {Audit} from '../../shared/model/audit.interface';
import {ActivatedRoute} from '@angular/router';
import {switchMap} from 'rxjs';

@Component({
  selector: 'app-add-data-collector-modal',
  templateUrl: './add-data-collector-modal.component.html',
  styleUrls: ['./add-data-collector-modal.component.scss'],
})
export class AddDataCollectorModalComponent implements OnInit {
  audit?: Audit;
  dataCollectors: DataCollector[] = [];
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
    ).subscribe((res: DataCollector[]) => {
      this.dataCollectors = res;
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
