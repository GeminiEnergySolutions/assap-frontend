import {AfterViewInit, Component, inject, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {NgbModal, NgbModalRef, NgbTooltip} from '@ng-bootstrap/ng-bootstrap';
import {SearchPipe} from '../../shared/pipe/search.pipe';
import {Step, TutorialService} from '../tutorial.service';

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

  steps: (Step & {selector: string})[] = [];
  target?: { top: number; left: number; width: number; height: number };
  search = '';

  ngOnInit() {
    this.tutorialService.getAllSteps().subscribe(steps => {
      this.steps = Object.entries(steps).map(([selector, step]) => ({
        selector,
        ...step,
      }));
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
