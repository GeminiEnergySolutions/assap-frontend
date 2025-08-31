import {AfterViewInit, Component, inject, OnDestroy, TemplateRef, ViewChild} from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {ModalModule} from '@mean-stream/ngbx';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {TutorialService} from '../tutorial.service';

@Component({
  selector: 'app-select-element',
  imports: [
    ModalModule,
    RouterLink,
  ],
  templateUrl: './select-element.component.html',
  styleUrl: './select-element.component.scss'
})
export class SelectElementComponent implements AfterViewInit, OnDestroy {
  @ViewChild('content', {static: true}) content!: TemplateRef<unknown>;

  readonly ngbModal = inject(NgbModal);
  readonly route = inject(ActivatedRoute);
  readonly router = inject(Router);
  readonly tutorialService = inject(TutorialService);

  modalRef?: NgbModalRef;

  targetAreas: { selector: string; element: HTMLElement; top: number; left: number; width: number; height: number }[] = [];

  ngAfterViewInit() {
    this.modalRef = this.ngbModal.open(this.content, {
      size: 'sm',
      backdrop: false,
      windowClass: 'pointer-events-none',
      modalDialogClass: 'me-3',
      fullscreen: false,
    });

    this.tutorialService.getAllSelectors().subscribe(selectors => {
      const elements = document.querySelectorAll(selectors.join(', '));
      elements.forEach(element => {
        const rect = element.getBoundingClientRect();
        this.targetAreas.push({
          selector: '#' + element.id,
          element: element as HTMLElement,
          top: rect.top + window.scrollY,
          left: rect.left + window.scrollX,
          width: rect.width,
          height: rect.height,
        });
      });
    });
  }

  ngOnDestroy() {
    this.modalRef?.dismiss('destroy');
  }
}
