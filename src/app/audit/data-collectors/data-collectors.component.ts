import {TitleCasePipe} from '@angular/common';
import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {ModalModule, ToastService} from '@mean-stream/ngbx';
import {switchMap} from 'rxjs';
import {AuditService} from 'src/app/shared/services/audit.service';
import {icons} from '../../shared/icons';
import {Audit} from '../../shared/model/audit.interface';
import {User} from '../../shared/model/user.interface';
import {SearchPipe} from '../../shared/pipe/search.pipe';
import {Breadcrumb, BreadcrumbService} from '../../shared/services/breadcrumb.service';
import {DataCollectorService} from '../../shared/services/data-collector.service';

@Component({
  selector: 'app-data-collectors',
  templateUrl: './data-collectors.component.html',
  styleUrls: ['./data-collectors.component.scss'],
  imports: [
    ModalModule,
    FormsModule,
    TitleCasePipe,
    SearchPipe,
  ],
})
export class DataCollectorsComponent implements OnInit, OnDestroy {
  private auditService = inject(AuditService);
  private dataCollectorService = inject(DataCollectorService);
  private toastService = inject(ToastService);
  private route = inject(ActivatedRoute);
  private breadcrumbService = inject(BreadcrumbService);

  audit?: Audit;
  activeDataCollectors: User[] = [];
  inactiveDataCollectors: User[] = [];
  selected: Partial<Record<number, boolean>> = {};

  searchActive = '';
  searchInactive = '';

  ngOnInit(): void {
    const breadcrumb: Breadcrumb = {label: '', class: icons.audit, routerLink: '..', relativeTo: this.route};
    this.breadcrumbService.pushBreadcrumb(breadcrumb);
    this.breadcrumbService.pushBreadcrumb({
      class: icons.dataCollectors,
      label: 'Data Collectors',
      routerLink: '.',
      relativeTo: this.route,
    });

    this.route.params.pipe(
      switchMap(({aid}) => this.auditService.getSingleAudit(aid)),
    ).subscribe(({data}) => {
      this.audit = data;
      breadcrumb.label = data.auditName;
    });

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

  ngOnDestroy() {
    this.breadcrumbService.popBreadcrumb();
    this.breadcrumbService.popBreadcrumb();
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
