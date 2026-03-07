import {Component, forwardRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {Editor, NgxEditorComponent, NgxEditorModule, Toolbar} from 'ngx-editor';

@Component({
  selector: 'app-editor',
  imports: [
    NgxEditorModule,
  ],
  providers: [
    {provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => EditorComponent), multi: true},
  ],
  templateUrl: './editor.component.html',
  styleUrl: './editor.component.css',
})
export class EditorComponent implements OnInit, OnDestroy, ControlValueAccessor {
  editor!: Editor;
  toolbar: Toolbar = [
    ['bold', 'italic', 'underline', 'strike', 'superscript', 'subscript'],
    ['ordered_list', 'bullet_list', 'indent', 'outdent'],
    [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
    ['link', 'image', 'horizontal_rule'],
    ['text_color', 'background_color', 'format_clear'],
    ['undo', 'redo'],
  ];

  @ViewChild('editorComponent', {static: true}) editorComponent!: NgxEditorComponent;

  ngOnInit() {
    this.editor = new Editor({

    });
  }

  ngOnDestroy() {
    this.editor.destroy();
  }

  writeValue(obj: Record<string, unknown> | string | null): void {
    if (!this.editorComponent.editor) {
      return;
    }
    this.editorComponent.writeValue(obj);
  }

  registerOnChange(fn: () => void): void {
    this.editorComponent.registerOnChange(fn);
  }

  registerOnTouched(fn: () => void): void {
    this.editorComponent.registerOnTouched(fn);
  }

  setDisabledState?(isDisabled: boolean): void {
    if (!this.editorComponent.editor) {
      return;
    }
    this.editorComponent.setDisabledState(isDisabled);
  }
}
