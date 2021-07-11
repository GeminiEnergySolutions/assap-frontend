import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreZoneComponent } from './pre-zone.component';

describe('PreZoneComponent', () => {
  let component: PreZoneComponent;
  let fixture: ComponentFixture<PreZoneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PreZoneComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PreZoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
