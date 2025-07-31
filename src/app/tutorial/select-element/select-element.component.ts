import {AfterViewInit, Component, inject, OnDestroy, TemplateRef, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ModalModule} from '@mean-stream/ngbx';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-select-element',
  imports: [
    ModalModule,
  ],
  templateUrl: './select-element.component.html',
  styleUrl: './select-element.component.scss'
})
export class SelectElementComponent implements AfterViewInit, OnDestroy {
  @ViewChild('content', {static: true}) content!: TemplateRef<unknown>;

  readonly ngbModal = inject(NgbModal);
  readonly route = inject(ActivatedRoute);
  readonly router = inject(Router);

  modalRef?: NgbModalRef;

  ngAfterViewInit() {
    this.modalRef = this.ngbModal.open(this.content, {
      beforeDismiss: () => this.router.navigate(['..'], {relativeTo: this.route}).then(() => true),
      size: 'sm',
      backdrop: false,
      windowClass: 'pointer-events-none',
      modalDialogClass: 'me-3',
      fullscreen: false,
    });
  }

  ngOnDestroy() {
    this.modalRef?.dismiss();
  }
}
