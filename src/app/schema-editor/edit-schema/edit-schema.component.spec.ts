import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSchemaComponent } from './edit-schema.component';

describe('SchemaEditorComponent', () => {
  let component: EditSchemaComponent;
  let fixture: ComponentFixture<EditSchemaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditSchemaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditSchemaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
