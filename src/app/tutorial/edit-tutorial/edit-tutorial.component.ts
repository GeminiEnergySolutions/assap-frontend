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

  /** If set, element picker mode is active */
  pick?: 'selector' | 'next' | 'skip';
  selectorOptions?: string[];

  modalRef?: NgbModalRef;

  edit = false;
  step: Step = {
    selector: '',
    title: '',
    description: '',
  };

  ngOnInit() {
    this.route.params.pipe(
      tap(({selector}) => {
        if (selector) {
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

  pickElement(pick: 'selector' | 'next' | 'skip') {
    this.pick = pick;
    this.selectorOptions = undefined;
    document.addEventListener('click', (event: Event) => {
      event.stopImmediatePropagation();
      event.preventDefault();
      if (event.target instanceof HTMLElement) {
        this.setSelectorOptions(event.target);
      }
    }, {once: true, capture: true});
  }

  chooseSelector(selector: string) {
    if (!this.pick) {
      return;
    }

    this.step[this.pick] = selector;
    this.cancelPick();
  }

  cancelPick() {
    this.pick = undefined;
    this.selectorOptions = undefined;
  }

  setSelectorOptions(element: HTMLElement) {
    let selectors: string[] = [];
    if (element.id) {
      selectors.push(`#${element.id}`);
    }
    if (element.classList.length) {
      selectors.push(`.${Array.from(element.classList).filter(s => !s.startsWith('ng-')).join('.')}`);
    }
    for (const attribute of ['name', 'title', 'aria-label', 'placeholder']) {
      if (element.hasAttribute(attribute)) {
        selectors.push(`[${attribute}="${element.getAttribute(attribute)}"]`);
      }
    }
    // Remove selectors that don't uniquely identify the element
    selectors = selectors.filter(s => {
      const matching = document.querySelectorAll(s);
      return matching.length === 1 && matching.item(0) === element;
    });
    this.selectorOptions = selectors;
  }

  save() {
    this.tutorialService.saveStep(this.step).subscribe();
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
