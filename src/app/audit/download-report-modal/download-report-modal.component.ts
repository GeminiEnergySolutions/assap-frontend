import {PercentPipe} from '@angular/common';
import {HttpErrorResponse} from '@angular/common/http';
import {Component, inject, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ModalModule} from '@mean-stream/ngbx';
import {combineLatest, switchMap} from 'rxjs';
import {AuditService} from '../../shared/services/audit.service';

@Component({
  selector: 'app-download-report-modal',
  imports: [
    ModalModule,
    PercentPipe,
  ],
  templateUrl: './download-report-modal.component.html',
  styleUrl: './download-report-modal.component.scss'
})
export class DownloadReportModalComponent implements OnInit {
  private readonly auditService = inject(AuditService);
  private readonly route = inject(ActivatedRoute);

  progress = 0;
  error?: string;

  ngOnInit() {
    combineLatest([this.route.params, this.route.queryParams]).pipe(
      switchMap(([{aid}, {type}]) => this.auditService.generateReport({
        auditId: +aid,
        type,
      })),
    ).subscribe(event => {
      this.progress = 1;
      console.log(event);
    }, async error => {
      this.progress = 0;
      if (error instanceof HttpErrorResponse && error.error instanceof Blob && error.error.type === 'application/json') {
        const json = JSON.parse(await error.error.text());
        this.error = json?.message ?? error.message;
      } else {
        this.error = error.message ?? error.toString();
      }
    });
  }
}
