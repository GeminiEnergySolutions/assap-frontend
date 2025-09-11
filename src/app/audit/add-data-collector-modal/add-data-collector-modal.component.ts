import {TitleCasePipe} from '@angular/common';
import {Component, OnInit} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {ModalModule, ToastService} from '@mean-stream/ngbx';
import {switchMap} from 'rxjs';
import {AuditService} from 'src/app/shared/services/audit.service';
import {Audit} from '../../shared/model/audit.interface';
import {User} from '../../shared/model/user.interface';
import {SearchPipe} from '../../shared/pipe/search.pipe';
import {DataCollectorService} from '../../shared/services/data-collector.service';

@Component({
  selector: 'app-add-data-collector-modal',
  templateUrl: './add-data-collector-modal.component.html',
  styleUrls: ['./add-data-collector-modal.component.scss'],
  imports: [
    ModalModule,
    FormsModule,
    TitleCasePipe,
    SearchPipe,
  ],
})
export class AddDataCollectorModalComponent implements OnInit {
  audit?: Audit;
  activeDataCollectors: User[] = [];
  inactiveDataCollectors: User[] = [];
  selected: Partial<Record<number, boolean>> = {};

  searchActive = '';
  searchInactive = '';

  constructor(
    private auditService: AuditService,
    private dataCollectorService: DataCollectorService,
    private toastService: ToastService,
    private route: ActivatedRoute,
  ) {
  }

  ngOnInit(): void {
    this.route.params.pipe(
      switchMap(({aid}) => this.auditService.getSingleAudit(aid)),
    ).subscribe(({data}) => this.audit = data);

    this.route.params.pipe(
      switchMap(({aid}) => this.dataCollectorService.getDataCollectors(aid, 'assigned')),
    ).subscribe(({data}) => {
      this.activeDataCollectors = data;
      this.selected = {};
      for (const user of data) {
        this.selected[user.id] = true;
      }
    });

    this.route.params.pipe(
      switchMap(({aid}) => this.dataCollectorService.getDataCollectors(aid, 'unassigned')),
    ).subscribe(({data}) => {
      this.inactiveDataCollectors = data;
    });
  }

  saveDataCollectors(): void {
    const removed = this.activeDataCollectors
      .filter(d => !this.selected[d.id]);
    if (!removed.length) {
      this.toastService.warn('Remove Data Collectors', 'No changes to save.');
      return;
    }
    this.dataCollectorService.deleteDataCollectors(this.audit!.auditId, removed.map(d => d.id)).subscribe(() => {
      this.toastService.warn('Remove Data Collectors', `Successfully removed ${removed.length} data collectors.`);
      this.inactiveDataCollectors.unshift(...removed);
      this.activeDataCollectors = this.activeDataCollectors.filter(d => this.selected[d.id]);
    });
  }

  addDataCollectors(): void {
    const assigned = this.inactiveDataCollectors
      .filter(d => this.selected[d.id]);
    if (!assigned.length) {
      this.toastService.warn('Add Data Collectors', 'No changes to save.');
      return;
    }
    this.dataCollectorService.assignDataCollectors(this.audit!.auditId, assigned.map(d => d.id)).subscribe(() => {
      this.toastService.success('Add Data Collectors', `Successfully added ${assigned.length} data collectors.`);
      this.activeDataCollectors.push(...assigned);
      this.inactiveDataCollectors = this.inactiveDataCollectors.filter(d => !this.selected[d.id]);
    });
  }
}
