import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreAuditComponent } from './pre-audit.component';

describe('PreAuditComponent', () => {
  let component: PreAuditComponent;
  let fixture: ComponentFixture<PreAuditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreAuditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreAuditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
