import {PercentPipe} from '@angular/common';
import {HttpClient, HttpErrorResponse, HttpEventType} from '@angular/common/http';
import {Component, inject, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ModalModule} from '@mean-stream/ngbx';
import {saveAs} from 'file-saver';
import {switchMap} from 'rxjs';
import {environment} from '../../../environments/environment';

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
  private readonly http = inject(HttpClient);
  private readonly route = inject(ActivatedRoute);
  // private readonly authService = inject(AuthService);

  progress = 0;
  error?: string;

  ngOnInit() {
    this.route.params.pipe(
      switchMap(({aid}) => this.http.get(`${environment.url}api/reports/${this.route.snapshot.queryParams.type}/${aid}`, {
        // TODO remove this if possible
        // params: {auth_token: this.authService.getAuthToken() ?? ''},
        reportProgress: true,
        observe: 'events',
        responseType: 'blob',
      })),
    ).subscribe(event => {
      if (event.type === HttpEventType.DownloadProgress) {
        this.progress = event.loaded / (event.total ?? 2 ** 20); // rough estimate of 1 MiB total size
      } else if (event.type === HttpEventType.Response && event.body) {
        this.progress = 1;
        saveAs(event.body);
      }
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
