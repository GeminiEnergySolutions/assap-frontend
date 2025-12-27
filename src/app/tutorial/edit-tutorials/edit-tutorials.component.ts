import {AfterViewInit, Component, inject, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {NgbModal, NgbModalRef, NgbTooltip} from '@ng-bootstrap/ng-bootstrap';
import {SearchPipe} from '../../shared/pipe/search.pipe';
import {Step, TutorialService} from '../tutorial.service';

function sortPartialOrder(steps: Step[]) {
  // Sort by next attribute
  const stepMap = new Map(steps.map(step => [step.selector, step]));
  const sorted: Step[] = [];
  const visited = new Set<string>();

  function visit(step: Step) {
    if (visited.has(step.selector)) return;
    visited.add(step.selector);
    if (step.next) {
      const nextStep = stepMap.get(step.next);
      if (nextStep) visit(nextStep);
    }
    if (step.skip) {
      const skipStep = stepMap.get(step.skip);
      if (skipStep) visit(skipStep);
    }
    sorted.push(step);
  }

  steps.forEach(visit);
  return sorted.reverse();
}

@Component({
  selector: 'app-edit-tutorials',
  imports: [
    RouterLink,
    NgbTooltip,
    FormsModule,
    SearchPipe,
  ],
  templateUrl: './edit-tutorials.component.html',
  styleUrl: './edit-tutorials.component.scss'
})
export class EditTutorialsComponent implements OnInit, AfterViewInit, OnDestroy {
  // TODO modal logic mostly copied from select-element.component.ts
  @ViewChild('content', {static: true}) content!: TemplateRef<unknown>;

  readonly ngbModal = inject(NgbModal);
  readonly route = inject(ActivatedRoute);
  readonly router = inject(Router);
  readonly tutorialService = inject(TutorialService);

  modalRef?: NgbModalRef;

  stepMap: Partial<Record<string, Step>> = {};
  steps: Step[] = [];
  target?: { top: number; left: number; width: number; height: number };
  search = '';

  ngOnInit() {
    this.tutorialService.getAllSteps().subscribe(steps => {
      this.steps = sortPartialOrder(steps);
      for (const step of steps) {
        this.stepMap[step.selector] = step;
      }
    });
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

  setTarget(selector: string) {
    const element = document.querySelector(selector);
    if (element) {
      const rect = element.getBoundingClientRect();
      this.target = {
        top: rect.top + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
        height: rect.height,
      };
    } else {
      this.target = undefined;
    }
  }

  ngOnDestroy() {
    this.modalRef?.dismiss('destroy');
  }
}
