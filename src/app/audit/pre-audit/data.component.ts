import { Component, Input, OnInit, ChangeDetectorRef } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'src/app/shared/services/auth.service';
import { DataCollector } from './data-collector.interface'; // Adjust the import path
import { AuditService } from 'src/app/shared/services/audit.service';
import { ToastService } from 'ng-bootstrap-ext';

@Component({
  template: `
    <div class="modal-header">
      <h4 class="modal-title">Add Data Collector ({{audit.auditName | titlecase}})</h4>
      <button type="button" class="btn-close btn-close-white" (click)="activeModal.dismiss()">
      </button>
    </div>
    <div class="modal-body" style="height: 200px; overflow-y: scroll;">
      <ul>
        <li *ngFor="let item of dataCollectors" class="data-collector-item">
          <label>
            <input type="checkbox" [(ngModel)]="item.selected" />
            {{ item.userName | titlecase }}
            <pre>{{ item.email }}</pre>

          </label>
        </li>
      </ul>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-secondary" (click)="activeModal.dismiss()">Close</button>
      <button type="button" class="btn btn-primary" (click)="onOkClick()">Add</button>
    </div>
  `,
})
export class AddDataCollectorModalComponent implements OnInit {
  audit: any;
  dataCollectors: DataCollector[] = [];

  constructor(
    private auditService: AuditService,
    private authService: AuthService,
    public activeModal: NgbActiveModal,
    private cdRef: ChangeDetectorRef,
    private toastService: ToastService,
  ) {}

  ngOnInit(): void {
    this.fetchDataCollectors();
  }

  fetchDataCollectors(): void {
    this.auditService.dataCollectors(this.audit.auditId).subscribe((res: DataCollector[]) => {
      this.dataCollectors = res.map((item: DataCollector) => ({
        ...item,
        selected: false,
      }));
      this.cdRef.detectChanges();
    });
  }

  onOkClick(): void {
    const selectedDataCollectors = this.dataCollectors.filter((item) => item.selected);

    if (!selectedDataCollectors.length) {
      this.activeModal.close();
      return;
    }

    let dataCollectorArray:any = [];
    for (const dataCollector of selectedDataCollectors) {
      const assignmentRequest = {
        dataCollectorId: dataCollector.id,
        auditId: this.audit.auditId,
      };
      dataCollectorArray.push(assignmentRequest);
    }

    this.auditService.assignAudits(dataCollectorArray).subscribe((res: any)=>{
      this.toastService.success('Success', `Audit Assignment successful`);
    });
    this.activeModal.close();
  }
}
