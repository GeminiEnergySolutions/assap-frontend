import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreTypeComponent } from './pre-type.component';

describe('PreTypeComponent', () => {
  let component: PreTypeComponent;
  let fixture: ComponentFixture<PreTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PreTypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PreTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
