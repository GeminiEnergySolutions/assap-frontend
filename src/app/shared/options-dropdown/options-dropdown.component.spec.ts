import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OptionsDropdownComponent } from './options-dropdown.component';

describe('OptionsDropdownComponent', () => {
  let component: OptionsDropdownComponent;
  let fixture: ComponentFixture<OptionsDropdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OptionsDropdownComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OptionsDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
