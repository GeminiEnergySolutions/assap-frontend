import {ComponentFixture, TestBed} from '@angular/core/testing';

import {SelectSchemaComponent} from './select-schema.component';

describe('SelectSchemaComponent', () => {
  let component: SelectSchemaComponent;
  let fixture: ComponentFixture<SelectSchemaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectSchemaComponent],
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectSchemaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
