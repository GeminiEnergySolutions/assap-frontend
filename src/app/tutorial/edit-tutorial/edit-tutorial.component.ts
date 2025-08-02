import {AfterViewInit, Component, inject, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {NgbModal, NgbModalRef, NgbTooltip} from '@ng-bootstrap/ng-bootstrap';
import {of, switchMap, tap} from 'rxjs';
import {Step, Trigger, TRIGGERS, TutorialService} from '../tutorial.service';

@Component({
  selector: 'app-edit-tutorial',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    FormsModule,
    NgbTooltip,

  ],
  templateUrl: './edit-tutorial.component.html',
  styleUrl: './edit-tutorial.component.scss'
})
export class EditTutorialComponent implements OnInit, AfterViewInit, OnDestroy {
// TODO modal logic mostly copied from select-element.component.ts
  @ViewChild('content', {static: true}) content!: TemplateRef<unknown>;

  protected readonly TRIGGERS = TRIGGERS;

  readonly ngbModal = inject(NgbModal);
  readonly route = inject(ActivatedRoute);
  readonly router = inject(Router);
  readonly tutorialService = inject(TutorialService);

  modalRef?: NgbModalRef;

  selector?: string;
  edit = false;
  step: Step = {
    title: '',
    description: '',
  };

  ngOnInit() {
    this.route.params.pipe(
      tap(({selector}) => {
        if (selector) {
          this.selector = selector;
          this.edit = true;
        } else {
          this.edit = false;
        }
      }),
      switchMap(({selector}) => selector ? this.tutorialService.getStep(selector) : of(this.step)),
    ).subscribe(step => {
      this.step = step;
    })
  }

  ngAfterViewInit() {
    this.modalRef = this.ngbModal.open(this.content, {
      size: 'md',
      scrollable: true,
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

  setListen(trigger: Trigger, checked: boolean) {
    if (checked) {
      (this.step.listen ??= []).push(trigger);
    } else if (this.step.listen) {
      const index = this.step.listen.indexOf(trigger);
      if (index !== -1) {
        this.step.listen.splice(index, 1);
      }
    }
  }
}
