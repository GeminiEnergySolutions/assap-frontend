import {KeyValuePipe} from '@angular/common';
import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {ToastService} from '@mean-stream/ngbx';
import {NgbOffcanvas, NgbPopover, NgbTooltip, NgbTypeahead} from '@ng-bootstrap/ng-bootstrap';
import {combineLatestWith, debounceTime, distinctUntilChanged, map, Observable, OperatorFunction} from 'rxjs';
import {EditorComponent} from '../../shared/components/editor/editor.component';

import {icons} from '../../shared/icons';
import {CopySpec, SchemaSection} from '../../shared/model/schema.interface';
import {ExpressionErrorPipe} from '../../shared/pipe/expression-error.pipe';
import {Breadcrumb, BreadcrumbService} from '../../shared/services/breadcrumb.service';
import {CopyPasteService} from '../../shared/services/copy-paste.service';
import {SchemaContextService} from '../schema-context.service';

@Component({
  selector: 'app-edit-section',
  templateUrl: './edit-section.component.html',
  styleUrl: './edit-section.component.scss',
  imports: [
    FormsModule,
    NgbTooltip,
    NgbPopover,
    NgbTypeahead,
    KeyValuePipe,
    ExpressionErrorPipe,
    EditorComponent,
  ],
})
export class EditSectionComponent implements OnInit, OnDestroy {
  section: SchemaSection = {id: 0, name: '', schema: []};

  allKeys: string[] = [];

  editSpec?: CopySpec;
  newSource = '';
  newTarget = '';

  search: OperatorFunction<string, readonly string[]> = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map((term) =>
        term.length < 2 ? [] : this.allKeys.filter((v) => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10),
      ),
    );

  constructor(
    private route: ActivatedRoute,
    private schemaContext: SchemaContextService,
    private breadcrumbService: BreadcrumbService,
    protected ngbOffcanvas: NgbOffcanvas,
    private copyPasteService: CopyPasteService,
    private toastService: ToastService,
  ) {
  }

  ngOnInit() {
    const breadcrumb: Breadcrumb = {label: '', class: icons.schemaSection, routerLink: '.', relativeTo: this.route};
    this.breadcrumbService.pushBreadcrumb(breadcrumb);

    this.route.params.pipe(
      combineLatestWith(this.schemaContext.loaded$),
    ).subscribe(([{section}]) => {
      this.section = this.schemaContext.schema.find(s => s.id == section) ?? this.section;
      this.allKeys = this.schemaContext.schema.flatMap(s => s.schema).map(e => e.key);
      breadcrumb.label = this.section.name;
    });
  }

  ngOnDestroy() {
    this.breadcrumbService.popBreadcrumb();
  }

  save() {
    this.schemaContext.save(this.section).subscribe();
  }

  addCondition() {
    ((this.section.conditionalSchema ??= {}).disabled ??= []).push({if: 'false', message: ''});
    this.setDirty();
  }

  removeCondition($index: number) {
    this.section.conditionalSchema?.disabled?.splice($index, 1);
    this.setDirty();
  }

  setDirty() {
    this.section._dirty = true;
  }

  addCopySpec() {
    this.section.copySchema?.push({buttonLabel: 'Copy', mappingInputs: {}});
    this.setDirty();
  }

  deleteCopySpec($index: number) {
    this.section.copySchema?.splice($index, 1);
    this.setDirty();
  }

  copyCopySpec(spec: CopySpec) {
    this.copyPasteService.copy(spec).subscribe(() => {
      this.toastService.success('Copied to Clipboard', 'Button and mappings copied to clipboard');
    });
  }

  pasteCopySpec() {
    this.copyPasteService.paste<CopySpec>([
      'buttonLabel',
      'mappingInputs',
    ]).subscribe({
      next: spec => {
        this.section.copySchema?.push(spec);
        this.setDirty();
        this.toastService.success('Pasted Copy Spec', 'Successfully pasted button and mappings');
      },
      error: error => this.toastService.error('Failed to Paste Copy Spec', 'Clipboard is empty or does not contain a valid copy spec', error),
    });
  }

  addMapping(source: string, target: string) {
    this.editSpec!.mappingInputs[target] = source;
    this.setDirty();
  }

  deleteMapping(key: string) {
    delete this.editSpec!.mappingInputs[key];
    this.setDirty();
  }
}
