import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {DataCollector} from './data-collector.interface';
import {AuditService} from 'src/app/shared/services/audit.service';
import {ToastService} from '@mean-stream/ngbx';

@Component({
  selector: 'app-add-data-collector-modal',
  templateUrl: './add-data-collector-modal.component.html',
  styleUrls: ['./add-data-collector-modal.component.scss'],
})
export class AddDataCollectorModalComponent implements OnInit {
  audit: any;
  dataCollectors: DataCollector[] = [];

  constructor(
    private auditService: AuditService,
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
