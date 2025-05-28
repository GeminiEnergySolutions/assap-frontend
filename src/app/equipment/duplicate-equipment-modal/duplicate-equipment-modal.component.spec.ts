import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DuplicateEquipmentModalComponent } from './duplicate-equipment-modal.component';

describe('DuplicateEquipmentModalComponent', () => {
  let component: DuplicateEquipmentModalComponent;
  let fixture: ComponentFixture<DuplicateEquipmentModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DuplicateEquipmentModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DuplicateEquipmentModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
