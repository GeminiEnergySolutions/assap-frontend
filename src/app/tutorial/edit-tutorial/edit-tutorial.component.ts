import {AfterViewInit, Component, inject, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {of, switchMap, tap} from 'rxjs';
import {Step, TutorialService} from '../tutorial.service';

@Component({
  selector: 'app-edit-tutorial',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    FormsModule,

  ],
  templateUrl: './edit-tutorial.component.html',
  styleUrl: './edit-tutorial.component.scss'
})
export class EditTutorialComponent implements OnInit, AfterViewInit, OnDestroy {
// TODO modal logic mostly copied from select-element.component.ts
  @ViewChild('content', {static: true}) content!: TemplateRef<unknown>;

  readonly ngbModal = inject(NgbModal);
  readonly route = inject(ActivatedRoute);
  readonly router = inject(Router);
  readonly tutorialService = inject(TutorialService);

  modalRef?: NgbModalRef;

  selector?: string;
  step: Step = {
    title: '',
    description: '',
  };

  ngOnInit() {
    this.route.params.pipe(
      tap(({selector}) => this.selector = selector),
      switchMap(({selector}) => selector ? this.tutorialService.getStep(selector) : of(this.step)),
    ).subscribe(step => {
      this.step = step;
    })
  }

  ngAfterViewInit() {
    this.modalRef = this.ngbModal.open(this.content, {
      size: 'sm',
      backdrop: false,
      windowClass: 'pointer-events-none',
      modalDialogClass: 'me-3',
      fullscreen: false,
    });
  }

  ngOnDestroy() {
    this.modalRef?.dismiss('destroy');
  }

  save() {
    if (!this.selector) {
      return;
    }
    this.tutorialService.saveStep(this.selector, this.step).subscribe();
  }
}
