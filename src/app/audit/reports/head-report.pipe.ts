import {inject, Pipe, PipeTransform} from '@angular/core';
import {map, Observable, of} from 'rxjs';
import {Report} from '../../shared/model/report.interface';
import {AuditService} from '../../shared/services/audit.service';

@Pipe({name: 'headReport'})
export class HeadReport implements PipeTransform {
  private readonly auditService = inject(AuditService);

  transform(report: Report): Observable<Report> {
    return report._head ? of(report) : this.auditService.headReport(report).pipe(
      map(res => {
        report._head = {
          size: +(res.headers.get('content-length') ?? 0),
          type: res.headers.get('content-type') ?? 'unknown',
          etag: res.headers.get('etag') ?? '-',
        };
        return report;
      }),
    );
  }
}
