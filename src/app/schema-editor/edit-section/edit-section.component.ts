import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {CopySpec, SchemaSection} from '../../shared/model/schema.interface';
import {SchemaContextService} from '../schema-context.service';
import {combineLatestWith} from 'rxjs';
import {NgbOffcanvas} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-edit-section',
  templateUrl: './edit-section.component.html',
  styleUrl: './edit-section.component.scss',
})
export class EditSectionComponent implements OnInit {
  section: SchemaSection = {id: 0, name: '', schema: []};

  editSpec?: CopySpec;

  constructor(
    private route: ActivatedRoute,
    private schemaContext: SchemaContextService,
    protected ngbOffcanvas: NgbOffcanvas,
  ) {
  }

  ngOnInit() {
    this.route.params.pipe(
      combineLatestWith(this.schemaContext.loaded$),
    ).subscribe(([{section}]) => {
      this.section = this.schemaContext.schema.find(s => s.id == section) ?? this.section;
    });
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
    this.section.copySchema?.push({buttonLabel: '', mappingInputs: {}});
    this.setDirty();
  }

  deleteCopySpec($index: number) {
    this.section.copySchema?.splice($index, 1);
    this.setDirty();
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
