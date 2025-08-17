import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DownloadReportModalComponent } from './download-report-modal.component';

describe('DownloadReportModalComponent', () => {
  let component: DownloadReportModalComponent;
  let fixture: ComponentFixture<DownloadReportModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DownloadReportModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DownloadReportModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
