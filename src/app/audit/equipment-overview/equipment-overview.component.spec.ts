import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EquipmentOverviewComponent } from './equipment-overview.component';

describe('EquipmentOverviewComponent', () => {
  let component: EquipmentOverviewComponent;
  let fixture: ComponentFixture<EquipmentOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EquipmentOverviewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EquipmentOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
